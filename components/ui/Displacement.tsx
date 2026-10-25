"use client";

import { useEffect, useRef } from "react";

// Adapted from Canvas UI "Displacement" (https://canvasui.dev/docs/components/displacement, David Haz).
// The original captures live HTML through the experimental html-in-canvas API (Chrome behind a flag only).
// Here the source is a 2D canvas painted by `paint`, so it runs in every WebGL2 browser.

export type DisplacementOptions = {
  /** Cells across the width (4 to 100). */
  grid?: number;
  /** Width to height ratio of each cell (0.25 to 4). */
  cellAspect?: number;
  /** Cursor influence radius as a fraction of the grid (0.02 to 1). */
  radius?: number;
  /** How hard cursor movement pushes cells (0 to 1). */
  strength?: number;
  /** Min cursor speed (CSS px/s) before cells react. */
  threshold?: number;
  /** How slowly cells return to rest, per frame (0.5 to 0.99). */
  relaxation?: number;
  /** How far displaced cells shift the content (0 to 4). */
  shift?: number;
  /** Chromatic aberration inside displaced cells (0 to 3). */
  aberration?: number;
  /** Film grain over displaced cells (0 to 1). */
  grain?: number;
  grainSize?: number;
  grainSpeed?: number;
  /** Random scramble on load that relaxes into place (0 to 3). */
  scramble?: number;
};

/** A cut-out photo drawn as a real 3D mesh (grayscale depth map pushes vertices toward the camera) that
 * leans toward the cursor, like landonorris.com. Its box must match the DOM photo's box. */
export type Head = {
  image: TexImageSource;
  /** Grayscale, white = near. Same aspect as `image`. */
  depth: TexImageSource;
  /** Photo box in CSS px relative to the canvas. */
  getRect: () => { x: number; y: number; w: number; h: number } | null;
  /** Max rotation in radians at the canvas edge. */
  intensity?: number;
  /** How far (in plane heights) full depth range pushes vertices. */
  depthScale?: number;
  /** Camera field of view in degrees. Small = nearly orthographic. */
  fov?: number;
};

/** Must be synchronous (no awaits): a paint that resumes after another started would draw twice onto the same canvas. */
export type Paint = (ctx: CanvasRenderingContext2D, width: number, height: number) => void;

const DEFAULTS: Required<DisplacementOptions> = {
  grid: 50,
  cellAspect: 1,
  radius: 0.1,
  strength: 0.1,
  threshold: 1000,
  relaxation: 0.9,
  shift: 1,
  aberration: 1.5,
  grain: 0.1,
  grainSize: 1,
  grainSpeed: 1,
  scramble: 1,
};

const VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main () {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uContent;
uniform sampler2D uField;
uniform sampler2D uHead;
uniform vec2 uResolution;
uniform float uShift;
uniform float uAberration;
uniform float uGrain;
uniform float uGrainPx;
uniform float uGrainTick;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

// 3D head mesh (premultiplied) over the painted backdrop
vec4 scene(vec2 uv) {
  vec4 b = texture(uContent, uv);
  vec4 h = texture(uHead, vec2(uv.x, 1.0 - uv.y)); // the FBO is stored bottom-up
  return h + b * (1.0 - h.a);
}

void main () {
  vec2 cuv = vec2(vUv.x, 1.0 - vUv.y);
  vec2 offset = texture(uField, cuv).rg;
  vec2 push = offset * 0.02 * uShift;
  float ab = uAberration * 0.08;
  vec2 lo = vec2(0.001);
  vec2 hi = vec2(0.999);
  vec4 cr = scene(clamp(cuv - push * (1.0 + ab), lo, hi));
  vec4 cg = scene(clamp(cuv - push, lo, hi));
  vec4 cb = scene(clamp(cuv - push * (1.0 - ab), lo, hi));
  float alpha = (cr.a + cg.a + cb.a) / 3.0;
  vec3 col = vec3(cr.r * cr.a, cg.g * cg.a, cb.b * cb.a);
  col = min(col, vec3(alpha));
  float pushPx = length(push * uResolution);
  float gate = smoothstep(1.5, 18.0, pushPx);
  vec2 cell = floor(gl_FragCoord.xy / max(uGrainPx, 1.0));
  float gn = hash(cell + vec2(uGrainTick * 0.37, uGrainTick * 0.113));
  col += (gn - 0.5) * 0.3 * uGrain * gate * alpha;
  col = clamp(col, vec3(0.0), vec3(alpha));
  outColor = vec4(col, alpha);
}`;

const HEAD_VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aUv;
uniform sampler2D uDepth;
uniform float uAspect;
uniform float uScale;
uniform float uF;
uniform float uDist;
uniform vec2 uRot;
uniform vec2 uSway;
out vec2 vUv;
void main () {
  vUv = aUv;
  // depth is centred on 0.5 so the average magnification (photo size) is unchanged
  float z = (textureLod(uDepth, aUv, 0.0).r - 0.5) * uScale;
  vec3 p = vec3((aUv.x - 0.5) * uAspect, 0.5 - aUv.y, z);
  float cy = cos(uRot.y), sy = sin(uRot.y);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  float cx = cos(uRot.x), sx = sin(uRot.x);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  p.xy -= uSway;
  gl_Position = vec4(p.x * uF / uAspect, p.y * uF, 0.0, uDist - p.z);
}`;

const HEAD_FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uPhoto;
void main () {
  outColor = texture(uPhoto, vUv);
}`;

const HEAD_GRID = 128; // segments per side

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/** Starts the effect on `output`; returns a cleanup fn, or null when WebGL2 is unavailable. */
function createDisplacement(
  output: HTMLCanvasElement,
  paint: Paint,
  config: Required<DisplacementOptions>,
  onReady?: () => void,
  head?: Head,
): (() => void) | null {
  const gl = output.getContext("webgl2", {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    premultipliedAlpha: true,
  });
  if (!gl || gl.isContextLost()) return null;

  const source = document.createElement("canvas");
  const sourceCtx = source.getContext("2d")!;

  const compile = (type: number, text: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, text);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Displacement shader error:", gl.getShaderInfoLog(shader));
    }
    return shader;
  };
  const vertexShader = compile(gl.VERTEX_SHADER, VERT);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const uniforms: Record<string, WebGLUniformLocation> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i)!;
    uniforms[info.name] = gl.getUniformLocation(program, info.name)!;
  }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const makeTexture = (filter: number) => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  };
  const contentTexture = makeTexture(gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
  const fieldTexture = makeTexture(gl.NEAREST);

  // ---- 3D head pass: renders the displaced photo mesh into headTexture; the main pass composites it over `paint` ----
  const headTexture = makeTexture(gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
  let headFbo: WebGLFramebuffer | null = null;
  let headProgram: WebGLProgram | null = null;
  let headVao: WebGLVertexArrayObject | null = null;
  let headIndexCount = 0;
  const headBuffers: WebGLBuffer[] = [];
  const headTextures: WebGLTexture[] = [];
  const headU: Record<string, WebGLUniformLocation | null> = {};
  let photoTexture: WebGLTexture | null = null;
  let depthTexture: WebGLTexture | null = null;
  const hd = { x: 0, y: 0, tx: 0, ty: 0 }; // eased cursor in -1..1, y up (like landonorris.com)

  if (head) {
    const vs = compile(gl.VERTEX_SHADER, HEAD_VERT);
    const fs = compile(gl.FRAGMENT_SHADER, HEAD_FRAG);
    headProgram = gl.createProgram()!;
    gl.attachShader(headProgram, vs);
    gl.attachShader(headProgram, fs);
    gl.linkProgram(headProgram);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    for (const name of ["uDepth", "uPhoto", "uAspect", "uScale", "uF", "uDist", "uRot", "uSway"]) {
      headU[name] = gl.getUniformLocation(headProgram, name);
    }

    const n = HEAD_GRID + 1;
    const uvs = new Float32Array(n * n * 2);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        uvs[2 * (j * n + i)] = i / HEAD_GRID;
        uvs[2 * (j * n + i) + 1] = j / HEAD_GRID;
      }
    }
    const idx = new Uint32Array(HEAD_GRID * HEAD_GRID * 6);
    let k = 0;
    for (let j = 0; j < HEAD_GRID; j++) {
      for (let i = 0; i < HEAD_GRID; i++) {
        const a = j * n + i;
        idx.set([a, a + 1, a + n, a + 1, a + n + 1, a + n], k);
        k += 6;
      }
    }
    headIndexCount = idx.length;
    headVao = gl.createVertexArray()!;
    gl.bindVertexArray(headVao);
    const uvBuf = gl.createBuffer()!;
    const idxBuf = gl.createBuffer()!;
    headBuffers.push(uvBuf, idxBuf);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad); // restore the fullscreen quad as the default-VAO attribute source

    const upload = (src: TexImageSource, mips: boolean, premultiply: boolean) => {
      const tex = gl.createTexture()!;
      headTextures.push(tex);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      if (mips) gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    };
    photoTexture = upload(head.image, true, true);
    depthTexture = upload(head.depth, false, false);
    headFbo = gl.createFramebuffer()!;
  }

  function allocHead() {
    if (!headFbo) return;
    gl!.bindTexture(gl!.TEXTURE_2D, headTexture);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, output.width, output.height, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, headFbo);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, headTexture, 0);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
  }

  function stepHead(delta: number): boolean {
    const k = 1 - Math.exp(-2.5 * delta); // ≈4%/frame at 60fps, same easing as landonorris.com
    hd.x += (hd.tx - hd.x) * k;
    hd.y += (hd.ty - hd.y) * k;
    return Math.abs(hd.tx - hd.x) + Math.abs(hd.ty - hd.y) > 0.0005;
  }

  function renderHead() {
    if (!head || !headFbo || !headProgram) return;
    const r = head.getRect();
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, headFbo);
    gl!.viewport(0, 0, output.width, output.height);
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    if (r && r.w > 1 && r.h > 1) {
      const fov = ((head.fov ?? 15) * Math.PI) / 180;
      const f = 1 / Math.tan(fov / 2);
      const intensity = head.intensity ?? 0.075;
      gl!.viewport(
        Math.round(r.x * dpr),
        Math.round(output.height - (r.y + r.h) * dpr),
        Math.round(r.w * dpr),
        Math.round(r.h * dpr),
      );
      gl!.useProgram(headProgram);
      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, photoTexture);
      gl!.uniform1i(headU.uPhoto, 0);
      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, depthTexture);
      gl!.uniform1i(headU.uDepth, 1);
      gl!.uniform1f(headU.uAspect, r.w / r.h);
      gl!.uniform1f(headU.uScale, head.depthScale ?? 0.25);
      gl!.uniform1f(headU.uF, f);
      gl!.uniform1f(headU.uDist, 0.5 * f); // a flat plane then exactly fills the viewport
      const tilt = window.innerWidth > 768 ? 1 : 0; // vertical tilt only on larger screens, like the reference
      gl!.uniform2f(headU.uRot, -hd.y * intensity * tilt, hd.x * intensity);
      gl!.uniform2f(headU.uSway, hd.x * 0.02, -hd.y * 0.02 * tilt);
      gl!.bindVertexArray(headVao);
      gl!.drawElements(gl!.TRIANGLES, headIndexCount, gl!.UNSIGNED_INT, 0);
      gl!.bindVertexArray(null);
      gl!.disable(gl!.BLEND);
    }
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
  }

  let cols = 0;
  let rows = 0;
  let rowScale = 1;
  let outW = 1;
  let outH = 1;
  let dpr = 1;
  let scrambled = false;
  let field = new Float32Array(0);
  let fieldDirty = false;
  let destroyed = false;

  function syncGrid() {
    const nextCols = Math.round(clamp(config.grid, 4, 100));
    const aspect = clamp(config.cellAspect, 0.25, 4);
    const nextRows = Math.max(2, Math.min(Math.round((nextCols * outH * aspect) / outW), 200));
    rowScale = (outH * nextCols) / (outW * nextRows);
    if (nextCols === cols && nextRows === rows) return;
    cols = nextCols;
    rows = nextRows;
    field = new Float32Array(cols * rows * 2);
    if (!scrambled && config.scramble > 0) {
      const amp = 40 * Math.min(config.scramble, 3);
      for (let i = 0; i < field.length; i++) field[i] = (Math.random() * 2 - 1) * amp;
    }
    scrambled = true;
    gl!.bindTexture(gl!.TEXTURE_2D, fieldTexture);
    gl!.pixelStorei(gl!.UNPACK_ALIGNMENT, 1);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RG32F, cols, rows, 0, gl!.RG, gl!.FLOAT, field);
    fieldDirty = false;
  }

  // Paint the scene into the 2D source canvas, then upload it as the content texture.
  let ready = false;
  function repaint() {
    if (destroyed) return;
    source.width = output.width; // also clears it
    source.height = output.height;
    sourceCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint(sourceCtx, outW, outH);
    gl!.bindTexture(gl!.TEXTURE_2D, contentTexture);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, source);
    start(true);
    if (!ready) {
      ready = true;
      onReady?.();
    }
  }

  function syncCanvasSize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    outW = Math.max(1, output.clientWidth);
    outH = Math.max(1, output.clientHeight);
    output.width = Math.round(outW * dpr);
    output.height = Math.round(outH * dpr);
    syncGrid();
    allocHead();
    repaint();
  }

  const mouse = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0, speed: 0, gate: 0, lastT: 0 };
  let tracking = false;

  function stepSimulation(delta: number): boolean {
    const decay = Math.pow(clamp(config.relaxation, 0.5, 0.995), delta * 60);
    let maxAbs = 0;
    for (let i = 0; i < field.length; i++) {
      const value = field[i] * decay;
      field[i] = value;
      const abs = Math.abs(value);
      if (abs > maxAbs) maxAbs = abs;
    }
    const injecting = tracking && (mouse.vX !== 0 || mouse.vY !== 0);
    if (injecting) {
      const gridX = mouse.x * cols;
      const gridY = mouse.y * rows;
      const maxDist = cols * clamp(config.radius, 0.02, 1);
      const maxSq = maxDist * maxDist;
      const gain = clamp(config.strength, 0, 1) * 100 * mouse.gate;
      for (let j = 0; j < rows; j++) {
        const dy = (gridY - j) * rowScale;
        for (let i = 0; i < cols; i++) {
          const dx = gridX - i;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxSq) {
            const power = Math.min(maxDist / Math.sqrt(distSq), 10);
            const idx = 2 * (i + cols * j);
            field[idx] += gain * mouse.vX * power;
            field[idx + 1] += gain * mouse.vY * power;
          }
        }
      }
    }
    const vDecay = Math.pow(0.9, delta * 60);
    mouse.vX *= vDecay;
    mouse.vY *= vDecay;
    if (Math.abs(mouse.vX) < 0.0001) mouse.vX = 0;
    if (Math.abs(mouse.vY) < 0.0001) mouse.vY = 0;
    fieldDirty = true;
    const alive = injecting || mouse.vX !== 0 || mouse.vY !== 0 || maxAbs > 0.03;
    if (!alive && maxAbs > 0) field.fill(0);
    return alive;
  }

  let time = 0;
  function render() {
    renderHead();
    if (fieldDirty) {
      fieldDirty = false;
      gl!.bindTexture(gl!.TEXTURE_2D, fieldTexture);
      gl!.pixelStorei(gl!.UNPACK_ALIGNMENT, 1);
      gl!.texSubImage2D(gl!.TEXTURE_2D, 0, 0, 0, cols, rows, gl!.RG, gl!.FLOAT, field);
    }
    gl!.useProgram(program);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, contentTexture);
    gl!.uniform1i(uniforms.uContent, 0);
    gl!.activeTexture(gl!.TEXTURE1);
    gl!.bindTexture(gl!.TEXTURE_2D, fieldTexture);
    gl!.uniform1i(uniforms.uField, 1);
    gl!.activeTexture(gl!.TEXTURE2);
    gl!.bindTexture(gl!.TEXTURE_2D, headTexture);
    gl!.uniform1i(uniforms.uHead, 2);
    gl!.uniform2f(uniforms.uResolution, output.width, output.height);
    gl!.uniform1f(uniforms.uShift, clamp(config.shift, 0, 4));
    gl!.uniform1f(uniforms.uAberration, clamp(config.aberration, 0, 3));
    gl!.uniform1f(uniforms.uGrain, clamp(config.grain, 0, 1));
    gl!.uniform1f(uniforms.uGrainPx, Math.max(1, clamp(config.grainSize, 0.5, 4) * dpr * 1.5));
    gl!.uniform1f(uniforms.uGrainTick, Math.floor(time * clamp(config.grainSpeed, 0, 4) * 18));
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    gl!.viewport(0, 0, output.width, output.height);
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
  }

  let raf = 0;
  let lastTime = performance.now();
  let running = false;
  let visible = true;
  let needsFrame = false;

  function frame(now: number) {
    if (destroyed) return;
    if (!visible) {
      running = false;
      return;
    }
    const delta = Math.min((now - lastTime) / 1000, 1 / 30);
    lastTime = now;
    time += delta;
    const alive = stepSimulation(delta) || (head ? stepHead(delta) : false);
    render();
    if (!alive && !needsFrame) {
      running = false;
      return;
    }
    needsFrame = false;
    raf = requestAnimationFrame(frame);
  }

  function start(force = false) {
    if (force) needsFrame = true;
    if (destroyed || running || !visible) return;
    running = true;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  }

  // Pointer input is read on the parent so overlaid content still drives the effect.
  const pointerHost = output.parentElement ?? output;
  function onPointerMove(event: PointerEvent) {
    const box = output.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    const now = performance.now();
    if (!tracking) {
      tracking = true;
      mouse.prevX = x;
      mouse.prevY = y;
      mouse.speed = 0;
      mouse.gate = 0;
      mouse.lastT = now;
    }
    mouse.vX = x - mouse.prevX;
    mouse.vY = y - mouse.prevY;
    const dt = Math.max((now - mouse.lastT) / 1000, 0.001);
    mouse.lastT = now;
    const instSpeed = Math.hypot(mouse.vX * box.width, mouse.vY * box.height) / dt;
    mouse.speed += (instSpeed - mouse.speed) * Math.min(dt * 25, 1);
    const threshold = Math.max(config.threshold, 0);
    if (threshold <= 0) {
      mouse.gate = 1;
    } else {
      const step = clamp((mouse.speed - threshold) / threshold, 0, 1);
      mouse.gate = step * step * (3 - 2 * step);
    }
    mouse.prevX = x;
    mouse.prevY = y;
    mouse.x = x;
    mouse.y = y;
    hd.tx = x * 2 - 1;
    hd.ty = -(y * 2 - 1);
    start();
  }
  function onPointerLeave() {
    hd.tx = 0;
    hd.ty = 0;
    start();
    tracking = false;
    mouse.vX = 0;
    mouse.vY = 0;
    mouse.speed = 0;
    mouse.gate = 0;
  }
  // Scrolling moves the canvas under a still cursor; the next pointermove would read that as a huge
  // velocity and blast the whole area. Restart tracking instead.
  window.addEventListener("scroll", onPointerLeave, { passive: true });
  pointerHost.addEventListener("pointermove", onPointerMove, { passive: true });
  pointerHost.addEventListener("pointerleave", onPointerLeave, { passive: true });
  pointerHost.addEventListener("pointercancel", onPointerLeave, { passive: true });

  let resizeFrame = 0;
  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(syncCanvasSize);
  });
  resizeObserver.observe(output);

  const intersection = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1]?.isIntersecting ?? true;
    if (visible) start();
  });
  intersection.observe(output);

  syncCanvasSize();

  return () => {
    destroyed = true;
    cancelAnimationFrame(raf);
    cancelAnimationFrame(resizeFrame);
    resizeObserver.disconnect();
    intersection.disconnect();
    window.removeEventListener("scroll", onPointerLeave);
    pointerHost.removeEventListener("pointermove", onPointerMove);
    pointerHost.removeEventListener("pointerleave", onPointerLeave);
    pointerHost.removeEventListener("pointercancel", onPointerLeave);
    gl.deleteTexture(contentTexture);
    gl.deleteTexture(fieldTexture);
    gl.deleteTexture(headTexture);
    headTextures.forEach((t) => gl.deleteTexture(t));
    headBuffers.forEach((b) => gl.deleteBuffer(b));
    if (headVao) gl.deleteVertexArray(headVao);
    if (headFbo) gl.deleteFramebuffer(headFbo);
    if (headProgram) gl.deleteProgram(headProgram);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteBuffer(quad);
  };
}

type Props = DisplacementOptions & {
  /** Draws the scene that gets displaced, in CSS pixels. Re-run on resize. */
  paint: Paint;
  /** Optional 3D cut-out portrait drawn over `paint` (see `Head`). */
  head?: Head;
  /** Fires once the first frame is on screen, so the caller can hide its DOM fallback. */
  onReady?: () => void;
  className?: string;
};

/** Absolutely-positioned canvas that fills its (positioned) parent. Skipped under reduced motion. */
export default function Displacement({ paint, head, onReady, className, ...options }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const latest = useRef({ paint, head, onReady, options });

  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { paint, head, onReady, options } = latest.current;
    return createDisplacement(ref.current, paint, { ...DEFAULTS, ...options }, onReady, head) ?? undefined;
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
