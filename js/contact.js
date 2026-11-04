(function () {
  const form = document.getElementById("cform");
  if (!form) return;

  const ACCESS_KEY = "dfa987e3-7a21-475f-9a6d-f624651666e4";
  const btn = document.getElementById("sbtn");
  const btnText = btn.querySelector(".bt");
  const spin = btn.querySelector(".spin");
  const msg = document.getElementById("fmsg");
  const thanks = document.getElementById("thanks");

  const field = (n) => form.querySelector('[name="' + n + '"]');

  // preselect service from ?service=... (used by the "Get a Quote" buttons on services.html)
  try {
    const q = new URLSearchParams(location.search).get("service");
    const sel = form.querySelector('[name="service"]');
    if (q && sel) [...sel.options].forEach(o => { if (o.textContent.trim() === q.trim()) sel.value = o.value || o.textContent; });
  } catch (e) {}

  function setError(input, text) {
    const err = input.parentElement.querySelector(".err");
    if (err) err.textContent = text || "";
    input.setAttribute("aria-invalid", text ? "true" : "false");
  }

  function validate() {
    let ok = true;
    const name = field("name");
    const email = field("email");
    const message = field("message");

    if (!name.value.trim()) {
      setError(name, "Please enter your name.");
      ok = false;
    } else setError(name, "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError(email, "Please enter a valid email address.");
      ok = false;
    } else setError(email, "");

    if (message.value.trim().length < 10) {
      setError(message, "Please share a few details (at least 10 characters).");
      ok = false;
    } else setError(message, "");

    return ok;
  }

  function setLoading(on) {
    btn.disabled = on;
    spin.hidden = !on;
    btnText.textContent = on ? "Sending..." : "Send Your Inquiry";
  }

  function showMsg(text, type) {
    msg.textContent = text;
    msg.style.color = type === "error" ? "#d62828" : "#1a7f37";
  }

  // clear error as user types
  form.querySelectorAll("input, textarea").forEach((el) => {
    el.addEventListener("input", () => setError(el, ""));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showMsg("", "");

    if (!validate()) return;

    // honeypot: bots fill this, humans don't
    if (field("website").value) {
      form.hidden = true;
      thanks.hidden = false;
      return;
    }

    const data = new FormData(form);
    data.delete("website");
    data.append("access_key", ACCESS_KEY);
    data.append(
      "subject",
      "New Project Inquiry from " + field("name").value.trim(),
    );
    data.append("from_name", "YBCSOFT Website");

    setLoading(true);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = await res.json();

      if (json.success) {
        form.reset();
        form.hidden = true;
        thanks.hidden = false;
        thanks.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        showMsg(
          json.message || "Could not send your inquiry. Please try again.",
          "error",
        );
      }
    } catch (err) {
      showMsg(
        "Network error. Please try again or email ybcsoft7677@gmail.com.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  });
})();
