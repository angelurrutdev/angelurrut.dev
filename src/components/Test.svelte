<script lang="ts">
    import { mode } from 'mode-watcher';
  
    let div: HTMLDivElement | undefined = $state();
    let focused = false;
    let position = $state({ x: 0, y: 0 });
    let opacity = $state(0);
    let i: number = 0;
    let positions: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  
    const handleMouseMove = (e: MouseEvent) => {
      if (!div || focused) return;
      const rect = div.getBoundingClientRect();
      position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      positions[i] = position;
    };
  
    const handleFocus = () => {
      focused = true;
      opacity = 1;
    };
  
    const handleBlur = () => {
      focused = false;
      opacity = 0;
    };
  
    const handleMouseEnter = () => {
      opacity = 1;
    };
  
    const handleMouseLeave = () => {
      opacity = 0;
    };
  </script>
  
  <div
    role="contentinfo"
    bind:this={div}
    onmousemove={handleMouseMove}
    onfocus={handleFocus}
    onblur={handleBlur}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    class="relative flex flex-col rounded-md border-[1px] border-neutral-300 px-3 py-4 shadow-sm dark:border-neutral-800 bg-neutral-200/80 dark:bg-neutral-900"
  >
    <input
      aria-hidden="true"
      class="pointer-events-none absolute left-0 top-0 z-10 h-full w-full cursor-default rounded-[0.310rem] border transition-opacity duration-500 placeholder:select-none
      {$mode === 'dark' ? 'border-white/50' : 'border-gray-500'}
      "
      style="
        opacity: {opacity};
        -webkit-mask-image: radial-gradient(30% 30px at {position.x}px {position.y}px, black 45%, transparent);
        background-color: transparent;
      "
    />
    <div
      class="absolute -inset-px rounded-md opacity-0 transition duration-300 pointer-events-none"
      style="
        opacity: {opacity};
        background: radial-gradient(600px circle at {position.x}px {position.y}px, rgba(97, 97, 97, 0.1), transparent 60%);
      "
    ></div>
    <slot/>
  </div>