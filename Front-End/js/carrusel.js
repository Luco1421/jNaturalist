[] = funDanilo();
i;

document.querySelectorAll('.card').forEach(i => i.addEventListener('click', () => {
    info = obtenerDatos([i]);
    i.querySelector('.image').querySelector('img').src = info[url];
    sessionStorage.setItem('taxon', [i]);
    window.location.href = 'info.html';
    }
));
