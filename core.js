async function loadModuleContent(bookId) {
    const container = document.getElementById('moduleContainer');
    try {
        const response = await fetch('assets/data/books-manifest.json');
        const data = await response.json();
        const book = data.books.find(b => b.id === bookId);

        if(!book) {
            container.innerHTML = `<div class="text-center py-10 text-rose-600">Buku tidak terdaftar dalam manifes sistem.</div>`;
            return;
        }

        // Fetch HTML module file or render template
        const modResponse = await fetch(book.file);
        if(modResponse.ok) {
            const modHtml = await modResponse.text();
            // Ekstrak bagian body dari file module jika berbentuk dokumen lengkap
            const parser = new DOMParser();
            const doc = parser.parseFromString(modHtml, 'text/html');
            const mainContent = doc.querySelector('main') ? doc.querySelector('main').innerHTML : doc.body.innerHTML;
            container.innerHTML = mainContent;
            
            // Execute scripts inside loaded module if any
            doc.querySelectorAll('script').forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
            });
        } else {
            container.innerHTML = `
                <div class="bg-white p-8 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                    <span class="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">Précis Utama</span>
                    <h1 class="text-2xl font-bold text-slate-900">${book.title}</h1>
                    <p class="text-sm text-slate-600">${book.description}</p>
                    <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
                        File modul spesifik (<code>${book.file}</code>) sedang dalam tahap sinkronisasi direktori. Silakan buat file HTML modul di folder <code>modules/</code>.
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error("Gagal memuat modul:", error);
        container.innerHTML = `<div class="text-center py-10 text-rose-600">Terjadi kesalahan sistem saat memuat modul buku.</div>`;
    }
}