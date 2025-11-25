document.addEventListener('DOMContentLoaded', function() {
  // Initialize all compare sliders
  document.querySelectorAll('.compare-container').forEach(container => {
    const beforeImage = container.querySelector('.before-image');
    const handle = container.querySelector('.compare-handle');
    
    // Set initial position
    beforeImage.style.clipPath = 'inset(0 50% 0 0)';
    handle.style.left = '50%';
    let isDragging = false;
    let startX = 0;
    function updateSlider(x) {
      const rect = container.getBoundingClientRect();
      let offsetX = x - rect.left;
      offsetX = Math.max(0, Math.min(offsetX, rect.width));
      const percentage = (offsetX / rect.width) * 100;
      beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
      handle.style.left = `${percentage}%`;
    }
    // Mouse/touch events
    const handleMove = (e) => {
      if (!isDragging) return;
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      updateSlider(clientX);
    };
    const handleEnd = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
    const handleStart = (e) => {
      // Only start dragging if clicking on the handle or very close to it
      const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
      const rect = container.getBoundingClientRect();
      const handlePos = rect.left + (rect.width * 0.5); // Initial handle position
      
      if (Math.abs(clientX - handlePos) > 20 && !e.target.classList.contains('compare-handle')) {
        return; // Don't start dragging if click is far from handle
      }
      
      e.preventDefault();
      isDragging = true;
      startX = clientX;
      
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);
      
      updateSlider(clientX);
    };
    container.addEventListener('mousedown', handleStart);
    container.addEventListener('touchstart', handleStart, { passive: false });
    
    // Prevent click events from propagating when dragging
    container.addEventListener('click', (e) => {
      if (isDragging || Math.abs(e.clientX - startX) > 5) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
  });
  
  // Prevent zooming on mobile
  document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
  });
});