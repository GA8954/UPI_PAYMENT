(() => {
  const defaultCfg = {
    displayName: "RATION CARD",
    pageTitle: "Pay Securely",
    upiId: "9627019097-1@nyes",
    bankName: "India Post Payment Bank",
    accountHolder: "MALATI",
    accountNumber: "054410408230",
    ifsc: "IPOS0000001",
    branch: "India Post"
  };

  const cfg = { ...defaultCfg, ...(window.PAYMENT_CONFIG || {}) };
  const $ = (id) => document.getElementById(id);
  const amount = $("amount");
  const qrBox = $("qrcode");
  const fallback = $("qrFallback");
  let toastTimer;

  const clean = (value, placeholder) => {
    if (!value || !String(value).trim() || String(value).startsWith("ADD_")) {
      return placeholder;
    }
    return value;
  };

  const isValidUpiId = (value) => {
    if (!value) return false;
    const text = String(value).trim();
    if (text.startsWith("ADD_")) return false;
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/.test(text);
  };

  const upiReady = isValidUpiId(cfg.upiId);

  $("siteTitle").textContent = cfg.pageTitle || "Pay Securely";
  document.title = (cfg.pageTitle || "Pay Securely") + " | Payment Page";
  $("footerName").textContent = cfg.displayName || cfg.accountHolder || "RATION CARD";
  $("accountHolder").textContent = cfg.accountHolder || "MALATI";
  $("bankName").textContent = cfg.bankName || "India Post Payment Bank";
  $("accountNumber").textContent = clean(cfg.accountNumber, "054410408230");
  $("ifscCode").textContent = clean(cfg.ifsc, "IPOS0000001");
  $("branchName").textContent = cfg.branch || "India Post";
  $("upiIdText").textContent = cfg.upiId || "9627019097-1@nyes";

  function getUpiLink() {
    const upiId = String(cfg.upiId || "").trim();
    const payeeName = String(cfg.displayName || cfg.accountHolder || "MALATI").trim();
    const params = new URLSearchParams({
      pa: upiId,
      pn: payeeName,
      cu: "INR",
      tn: "Payment"
    });

    if (isValidUpiId(upiId)) {
      params.set("mode", "02");
    }

    const entered = Number(amount.value);
    if (amount.value && Number.isFinite(entered) && entered > 0) {
      params.set("am", entered.toFixed(2));
    }

    return "upi://pay?" + params.toString();
  }

  function renderQr() {
    qrBox.innerHTML = "";
    if (!upiReady || typeof QRCode === "undefined") {
      fallback.classList.remove("hidden");
      return;
    }

    fallback.classList.add("hidden");
    new QRCode(qrBox, {
      text: getUpiLink(),
      width: 184,
      height: 184,
      colorDark: "#142b2b",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  async function copyText(value, label) {
    if (!value || String(value).startsWith("ADD_")) {
      showToast("Please add your real " + label + " in config.js first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(String(value));
      showToast(label + " copied.");
    } catch {
      const temp = document.createElement("textarea");
      temp.value = String(value);
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
      showToast(label + " copied.");
    }
  }

  const copyValues = {
    upi: () => cfg.upiId,
    holder: () => cfg.accountHolder,
    bank: () => cfg.bankName,
    account: () => cfg.accountNumber,
    ifsc: () => cfg.ifsc,
    branch: () => cfg.branch
  };

  const copyLabels = {
    upi: "UPI ID",
    holder: "account holder",
    bank: "bank name",
    account: "account number",
    ifsc: "IFSC",
    branch: "branch"
  };

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.copy;
      const value = copyValues[key]?.();
      const label = copyLabels[key] || "detail";

      if (!value || String(value).startsWith("ADD_")) {
        showToast("Please add your real " + label + " in config.js first.");
        return;
      }

      copyText(value, label);
    });
  });

  $("payUpiBtn").addEventListener("click", () => {
    if (!upiReady) {
      showToast("Add your real UPI ID in config.js first.");
      return;
    }
    window.location.href = getUpiLink();
  });

  $("downloadQrBtn").addEventListener("click", () => {
    const canvas = qrBox.querySelector("canvas");
    const img = qrBox.querySelector("img");
    const source = canvas ? canvas.toDataURL("image/png") : (img ? img.src : "");
    if (!source) {
      showToast("Set your UPI ID first to generate a QR code.");
      return;
    }

    const link = document.createElement("a");
    link.href = source;
    link.download = "upi-payment-qr.png";
    link.click();
  });

  $("copyAllBtn").addEventListener("click", () => {
    const details = [
      "Account holder: " + (cfg.accountHolder || ""),
      "Bank: " + (cfg.bankName || ""),
      "Account number: " + (cfg.accountNumber || ""),
      "IFSC: " + (cfg.ifsc || ""),
      "Branch: " + (cfg.branch || "")
    ].join("\n");

    if (!cfg.accountNumber || String(cfg.accountNumber).startsWith("ADD_") ||
        !cfg.ifsc || String(cfg.ifsc).startsWith("ADD_")) {
      showToast("Complete account number and IFSC in config.js first.");
      return;
    }

    copyText(details, "bank details");
  });

  amount.addEventListener("input", renderQr);
  renderQr();
})();
