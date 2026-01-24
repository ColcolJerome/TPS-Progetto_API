window.addEventListener('load', function() {
    // Carica la libreria Mermaid
    var script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    document.head.appendChild(script);

    script.onload = function() {
        import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs').then(mermaid => {
            mermaid.default.initialize({ startOnLoad: true });
            
            // Trova i blocchi di codice JSDoc che contengono 'gantt'
            document.querySelectorAll('pre').forEach(function(el) {
                if (el.textContent.includes('gantt')) {
                    var container = document.createElement('div');
                    container.className = 'mermaid';
                    container.textContent = el.textContent;
                    el.parentNode.replaceWith(container);
                }
            });
            mermaid.default.run();
        });
    };
});
