const body = document.querySelector("body");
const scanResult = document.querySelector("#scan-result");
const backButton = document.querySelector("#back-button");
const reader = new Html5Qrcode("reader");

// URL spéciale (celle du QR code secret)
const secretPageUrl = "http://localhost:5500/projets/scanner/virus";
// Rick Roll YouTube officiel
const rickRollUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

backButton.addEventListener("click", resetScanner);

function resetScanner() {
  body.classList.remove("scanned");
  scanResult.textContent = "";
  reader.resume();
}

function onScanSuccess(decodedText, decodedResult) {
  console.log(`Scan result: ${decodedText}`, decodedResult);
  scanResult.textContent = decodedText;
  body.classList.add("scanned");
  reader.pause();

  // Redirection selon le contenu du QR code
  if (decodedText === secretPageUrl) {
    window.location.href = secretPageUrl;
  } else {
    window.location.href = rickRollUrl;
  }
}

function startCamera(cameraId) {
  if (!cameraId) return;

  if (reader.getState() === Html5QrcodeScannerState.SCANNING) {
    reader.stop();
  }

  localStorage.setItem("cameraId", cameraId);

  reader
    .start(
      cameraId,
      {
        facingMode: "environment",
      },
      onScanSuccess
    )
    .catch((err) => {
      console.error("Error starting camera: ", err);
    });
}

Html5Qrcode.getCameras()
  .then((devices) => {
    if (devices && devices.length) {
      const cameraSelect = document.querySelector("#camera-select");
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Choisissez une caméra";
      cameraSelect.appendChild(defaultOption);

      devices.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.id;
        option.textContent = device.label;
        cameraSelect.appendChild(option);
      });

      const savedCameraId = localStorage.getItem("cameraId");
      if (savedCameraId) {
        cameraSelect.value = savedCameraId;
        startCamera(savedCameraId);
      }

      cameraSelect.addEventListener("change", (event) => {
        const selectedCameraId = event.target.value;
        startCamera(selectedCameraId);
      });
    } else {
      console.error("No cameras found.");
    }
  })
  .catch((err) => {
    console.error("Error getting cameras: ", err);
  });
