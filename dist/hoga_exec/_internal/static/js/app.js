document.addEventListener('DOMContentLoaded', function() {
    const widget8 = document.getElementById('widget-8');
    const widget9 = document.getElementById('widget-9');
  
    widget8.addEventListener('click', function() {
      widget8.style.display = 'none';
      widget9.style.display = 'block';
    });
  
    widget9.addEventListener('click', function() {
      widget9.style.display = 'none';
      widget8.style.display = 'block';
    });
  });
  