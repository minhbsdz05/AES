document.addEventListener("DOMContentLoaded", function () {
  const modeSelect = document.getElementById("modeSelect");
  const encryptBox = document.getElementById("encryptBox");
  const decryptBox = document.getElementById("decryptBox");
  const encryptFileInput = document.getElementById("encryptFile");
  const decryptFileInput = document.getElementById("decryptFile");
  const encryptKeyInput = document.getElementById("encryptKey");
  const decryptKeyInput = document.getElementById("decryptKey");
  const encryptButton = document.getElementById("encryptButton");
  const decryptButton = document.getElementById("decryptButton");
  const downloadEncrypt = document.getElementById("downloadEncrypt");
  const downloadDecrypt = document.getElementById("downloadDecrypt");
  const encryptSuccessMessage = document.getElementById("encryptSuccessMessage");
  const decryptSuccessMessage = document.getElementById("decryptSuccessMessage");
  const decryptErrorMessage = document.getElementById("decryptErrorMessage");
  const encryptKeyStrengthDiv = document.getElementById("encryptKeyStrength");
  const decryptKeyStrengthDiv = document.getElementById("decryptKeyStrength");

  let encryptedData = "";
  let decryptedData = "";

  // Gợi ý độ mạnh của khóa
  function evaluateKeyStrength(key) {
    let strength = 0;
    if (key.length >= 8) strength++;
    if (/[a-z]/.test(key)) strength++;
    if (/[A-Z]/.test(key)) strength++;
    if (/[0-9]/.test(key)) strength++;
    if (/[^a-zA-Z0-9]/.test(key)) strength++;

    if (strength <= 2) return { label: "Yếu (Nên dài hơn và thêm ký tự đặc biệt)", className: "weak" };
    if (strength === 3 || strength === 4) return { label: "Trung bình (Tạm ổn)", className: "medium" };
    return { label: "Mạnh (Tốt!)", className: "strong" };
  }

  encryptKeyInput.addEventListener("input", () => {
    const result = evaluateKeyStrength(encryptKeyInput.value);
    encryptKeyStrengthDiv.textContent = "🔍 " + result.label;
    encryptKeyStrengthDiv.className = `key-strength ${result.className}`;
  });

  decryptKeyInput.addEventListener("input", () => {
    const result = evaluateKeyStrength(decryptKeyInput.value);
    decryptKeyStrengthDiv.textContent = "🔍 " + result.label;
    decryptKeyStrengthDiv.className = `key-strength ${result.className}`;
  });

  // Chuyển chế độ
  modeSelect.addEventListener("change", function () {
    const mode = this.value;
    if (mode === "encrypt") {
      encryptBox.style.display = "block";
      decryptBox.style.display = "none";
    } else {
      encryptBox.style.display = "none";
      decryptBox.style.display = "block";
    }

    // Ẩn thông báo khi chuyển chế độ
    encryptSuccessMessage.style.display = "none";
    decryptSuccessMessage.style.display = "none";
    decryptErrorMessage.style.display = "none";
  });

  // Mặc định: hiện mã hóa
  encryptBox.style.display = "block";
  decryptBox.style.display = "none";

  // Xử lý mã hóa
  encryptButton.addEventListener("click", () => {
    const file = encryptFileInput.files[0];
    const key = encryptKeyInput.value;

    if (!file || !key) {
      alert("Vui lòng chọn file và nhập khóa.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      try {
        encryptedData = CryptoJS.AES.encrypt(content, key).toString();
        encryptSuccessMessage.style.display = "block";
        downloadEncrypt.disabled = false;
      } catch (err) {
        alert("Mã hóa thất bại: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  downloadEncrypt.addEventListener("click", () => {
    const blob = new Blob([encryptedData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "encrypted.txt";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Xử lý giải mã
  decryptButton.addEventListener("click", () => {
    const file = decryptFileInput.files[0];
    const key = decryptKeyInput.value;

    if (!file || !key) {
      alert("Vui lòng chọn file và nhập khóa.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      try {
        const bytes = CryptoJS.AES.decrypt(content, key);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        if (!originalText) {
          throw new Error("Sai khóa hoặc dữ liệu không hợp lệ.");
        }

        decryptedData = originalText;
        decryptSuccessMessage.style.display = "block";
        decryptErrorMessage.style.display = "none";
        downloadDecrypt.disabled = false;
      } catch (err) {
        decryptSuccessMessage.style.display = "none";
        decryptErrorMessage.style.display = "block";
        downloadDecrypt.disabled = true;
      }
    };
    reader.readAsText(file);
  });

  downloadDecrypt.addEventListener("click", () => {
    const blob = new Blob([decryptedData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "decrypted.txt";
    a.click();
    URL.revokeObjectURL(url);
  });
});
