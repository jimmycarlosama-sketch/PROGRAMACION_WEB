/* ZONA FÚTBOL | Interactividad con JavaScript */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // 1. MENÚ DESPLEGABLE: muestra u oculta la navegación en pantallas pequeñas.
    const menuButton = document.querySelector('#menu-toggle');
    const menuList = document.querySelector('#menu-principal');

    if (menuButton && menuList) {
        menuButton.addEventListener('click', () => {
            const isOpen = menuList.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
            menuButton.textContent = isOpen ? '✕ Cerrar menú' : '☰ Menú';
        });

        menuList.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                menuList.classList.remove('is-open');
                menuButton.setAttribute('aria-expanded', 'false');
                menuButton.textContent = '☰ Menú';
            });
        });
    }

    // 2. CARRUSEL: cambia la diapositiva y actualiza los indicadores.
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    const counter = document.querySelector('#slide-counter');
    let currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) return;
        currentSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, position) => {
            const active = position === currentSlide;
            slide.hidden = !active;
            slide.classList.toggle('is-active', active);
            slide.setAttribute('aria-hidden', String(!active));
        });

        dots.forEach((dot, position) => {
            const active = position === currentSlide;
            dot.classList.toggle('is-active', active);
            if (active) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });

        if (counter) counter.textContent = `${currentSlide + 1} / ${slides.length}`;
    }

    document.querySelector('#prev-slide')?.addEventListener('click', () => showSlide(currentSlide - 1));
    document.querySelector('#next-slide')?.addEventListener('click', () => showSlide(currentSlide + 1));
    dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.goTo))));
    showSlide(0);

    // 3. VENTANA EMERGENTE: presenta información del club seleccionado.
    const teamData = {
        'real-madrid': {
            name: 'Real Madrid',
            description: 'Club español fundado en 1902, reconocido por su trayectoria en el fútbol nacional e internacional.',
            extra: 'País: España · Estadio: Santiago Bernabéu.'
        },
        barcelona: {
            name: 'FC Barcelona',
            description: 'Club español fundado en 1899, conocido por su identidad deportiva y su tradición formativa.',
            extra: 'País: España · Estadio: Spotify Camp Nou (nombre indicado en el proyecto).'
        },
        'manchester-city': {
            name: 'Manchester City',
            description: 'Club inglés con una larga historia y presencia destacada en competiciones nacionales e internacionales.',
            extra: 'País: Inglaterra · Estadio: Etihad Stadium.'
        },
        'atletico-nacional': {
            name: 'Atlético Nacional',
            description: 'Club colombiano con sede en Medellín y una amplia afición en el fútbol nacional.',
            extra: 'País: Colombia · Estadio: Atanasio Girardot.'
        }
    };

    const teamDialog = document.querySelector('#team-dialog');
    const dialogTitle = document.querySelector('#dialog-title');
    const dialogDescription = document.querySelector('#dialog-description');
    const dialogExtra = document.querySelector('#dialog-extra');

    document.querySelectorAll('.team-details').forEach((button) => {
        button.addEventListener('click', () => {
            const team = teamData[button.dataset.team];
            if (!team || !teamDialog) return;
            dialogTitle.textContent = team.name;
            dialogDescription.textContent = team.description;
            dialogExtra.textContent = team.extra;
            teamDialog.showModal();
        });
    });

    function closeTeamDialog() {
        if (teamDialog?.open) teamDialog.close();
    }
    document.querySelector('#close-dialog')?.addEventListener('click', closeTeamDialog);
    document.querySelector('#dialog-ok')?.addEventListener('click', closeTeamDialog);
    teamDialog?.addEventListener('click', (event) => {
        if (event.target === teamDialog) closeTeamDialog();
    });

    // 4. FORMULARIO: valida los datos y muestra confirmación local.
    // No envía información a un servidor; es una demostración front-end.
    const form = document.querySelector('#registration-form');
    const message = document.querySelector('#form-message');

    if (form && message) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            message.textContent = '';
            message.className = 'form-message';

            const name = form.querySelector('#nombre');
            const age = form.querySelector('#edad');
            const favoriteTeam = form.querySelector('#equipo');
            const interests = form.querySelectorAll('input[name="intereses"]:checked');

            if (!form.checkValidity()) {
                form.reportValidity();
                message.textContent = 'Revisa los campos obligatorios antes de continuar.';
                message.classList.add('error');
                return;
            }

            if (name.value.trim().length < 3) {
                name.setCustomValidity('Escribe un nombre de al menos 3 caracteres.');
                name.reportValidity();
                name.setCustomValidity('');
                return;
            }

            if (Number(age.value) < 5 || Number(age.value) > 100) {
                age.setCustomValidity('La edad debe estar entre 5 y 100 años.');
                age.reportValidity();
                age.setCustomValidity('');
                return;
            }

            if (interests.length === 0) {
                message.textContent = 'Selecciona al menos un interés deportivo.';
                message.classList.add('error');
                form.querySelector('input[name="intereses"]')?.focus();
                return;
            }

            // Se guarda el texto ANTES de limpiar el formulario, porque reset() borra los campos.
            const successText = `¡Gracias, ${name.value.trim()}! Tu registro de demostración se completó correctamente. Equipo favorito: ${favoriteTeam.options[favoriteTeam.selectedIndex].text}.`;

            // Se limpian los campos sin disparar el borrado del mensaje.
            keepMessage = true;
            form.reset();
            keepMessage = false;

            message.textContent = successText;
            message.classList.add('success');
        });

        // Al pulsar "Limpiar formulario" se borra el mensaje,
        // pero no cuando el reset viene de un registro exitoso.
        let keepMessage = false;
        form.addEventListener('reset', () => {
            if (keepMessage) return;
            message.textContent = '';
            message.className = 'form-message';
        });
    }
});
