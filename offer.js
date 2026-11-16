/* /uslugi: fills the confirmed offer values and submits the request form (Web3Forms). */
(function () {
  "use strict";

  // 1. Offer values. A null value stays as a visible red-dashed [placeholder].
  var cfgEl = document.getElementById("offer-config");
  if (cfgEl) {
    var cfg = {};
    try {
      cfg = JSON.parse(cfgEl.textContent);
    } catch (e) {
      cfg = {};
    }
    document.querySelectorAll("[data-cfg]").forEach(function (el) {
      var v = cfg[el.getAttribute("data-cfg")];
      if (v !== null && v !== undefined && v !== "") {
        el.textContent = v;
        el.classList.remove("tbd");
      }
    });
  }

  // 2. Request form.
  var form = document.getElementById("offer-form");
  if (!form) return;
  var statusEl = document.getElementById("offer-status");
  var required = {
    "offer-name": "Моля, въведете името си.",
    "offer-phone": "Моля, въведете телефон за връзка.",
    "offer-email": "Моля, въведете валиден имейл.",
    "offer-business": "Моля, напишете какъв е бизнесът ви.",
    "offer-city": "Моля, въведете град.",
    "offer-hassite": "Моля, изберете отговор.",
  };

  function setStatus(msg, state) {
    statusEl.textContent = msg;
    if (state) statusEl.dataset.state = state;
    else delete statusEl.dataset.state;
  }

  function clearErrors() {
    Object.keys(required).forEach(function (id) {
      var input = document.getElementById(id);
      var err = document.getElementById(id + "-error");
      input.removeAttribute("aria-invalid");
      err.hidden = true;
      err.textContent = "";
    });
  }

  function validate() {
    var bad = [];
    Object.keys(required).forEach(function (id) {
      var el = document.getElementById(id);
      var v = el.value.trim();
      var ok = v.length > 0;
      if (id === "offer-email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      if (id === "offer-phone") ok = v.replace(/\D/g, "").length >= 7;
      if (!ok) bad.push(id);
    });
    return bad;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    setStatus("");

    var bad = validate();
    if (bad.length) {
      bad.forEach(function (id) {
        document.getElementById(id).setAttribute("aria-invalid", "true");
        var err = document.getElementById(id + "-error");
        err.textContent = required[id];
        err.hidden = false;
      });
      document.getElementById(bad[0]).focus();
      setStatus("Моля, поправете полетата по-горе.", "error");
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    var label = btn.innerHTML;
    btn.disabled = true;
    setStatus("Изпращане…", "");

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: new FormData(form),
    })
      .then(function (res) {
        return res.json().then(function (json) {
          if (res.status !== 200) throw new Error(json.message || "error");
        });
      })
      .then(function () {
        form.reset();
        setStatus("Заявката е изпратена. Ще ви отговоря в най-скоро време.", "success");
      })
      .catch(function () {
        setStatus(
          "Нещо се обърка. Опитайте пак или ми пишете на alexandar.webdesign@gmail.com.",
          "error",
        );
      })
      .then(function () {
        btn.disabled = false;
        btn.innerHTML = label;
      });
  });
})();
