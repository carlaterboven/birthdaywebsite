
const container = document.getElementById("imageContainer");
const checkboxes = document.querySelectorAll("#filterBar input[type='checkbox']");

const imageList = manageImageList;
let images = [];

// Funktion: kombiniere ausgewählte Kategorien
function updateImageList() {
    const selected = [...checkboxes]
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // Alle ausgewählten Listen zusammenführen
    const combinedList = selected
      .flatMap(key => imageList[key] || [])
      .sort(); // alphabetische Sortierung um projekte zusammen anzuzeigen


    // Bilder zu image-container hinzufügen
    container.innerHTML = "";
    combinedList.forEach(image => {
        const div = document.createElement("div");
        div.className = "image-container";
        const folder = image.split("/")[0];
        div.innerHTML = `<a href="projekte/${folder}.html"><img src="images/${image}" alt="${folder}"></a>`;

        container.appendChild(div);
    });

    images = document.querySelectorAll('.image-container');
}

// Event Listener für Änderungen
checkboxes.forEach(cb => cb.addEventListener("change", updateImageList));

// Initialer Aufruf
updateImageList();

let currentIndex = 0;
let scrollPosition = 0;
let scalingValue = 1; // Anfangsskalierung (Vollbild)
const maxScale = 0.02; // Minimale Größe des Bildes beim Verkleinern
const maxScrollPosition = (maxScale + 1) * 1000

// nicht alle Bilder sind von Anfang an im Hintergrund sichtbar
images.forEach((image, index) => {
    if (index == currentIndex) {
        image.classList.add('active');
    } else if (index == currentIndex +1) {
        image.classList.add('background');
    } else {
        image.classList.add('inactive');
    }
});

window.addEventListener('wheel', (e) => {
    const delta = e.deltaY;
    scrollPosition += delta; // delta>0: Scrollen nach unten, delta <0: Scrollen nach oben

    if (scrollPosition < 0) {
        scrollPosition = 0;
    }

    // Berechne den Skalierungswert basierend auf der Scrollposition
    scalingValue = 1 - Math.abs(scrollPosition) / 1000; // Die Skalierung kann von 1 bis maxScale (0.02) variieren
    scalingValue = Math.max(scalingValue, maxScale); // Skalierung niemals kleiner als maxScale (0.02)

    // Wende die Skalierung auf das aktive Bild an
    images[currentIndex].style.transform = `scale(${scalingValue})`;

    // Wechseln der Bilder, wenn genügend gescrollt wurde
    // Wenn nach unten gescrollt (delta>0), Bild wechseln nach unten
    if (scalingValue <= maxScale && delta > 0) {
        nextIndex = (currentIndex + 1) % images.length;
        secondNextIndex = (currentIndex + 2) % images.length;
        images[currentIndex].classList.add('inactive');
        images[currentIndex].classList.remove('active');
        images[nextIndex].classList.add('active');
        images[nextIndex].classList.remove('background');
        images[secondNextIndex].classList.add('background');
        images[secondNextIndex].style.transform = 'scale(1)';
        images[secondNextIndex].classList.remove('inactive');
        currentIndex = nextIndex;
        scrollPosition = 0;
    }
    else if (scalingValue >= 1 && delta < 0) {
        lastIndex = (currentIndex + 1) % images.length;
        nextIndex = (currentIndex - 1 + images.length) % images.length;
        images[currentIndex].classList.add('background');
        images[currentIndex].classList.remove('active');
        images[lastIndex].classList.add('inactive');
        images[lastIndex].classList.remove('background');
        images[nextIndex].classList.add('active');
        images[nextIndex].classList.remove('inactive');
        images[nextIndex].style.transform = `scale(${maxScale})`;
        currentIndex = nextIndex;
        scrollPosition = maxScrollPosition;
    }
});
