/* ==========================================================================
   FAAM — Fundação Antônio Augusto de Mattos
   Interações do site
   ========================================================================== */
(function () {
  "use strict";

  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Cabeçalho: sombra ao rolar
     ------------------------------------------------------------------ */
  const header = document.getElementById("header");
  const toTop = document.getElementById("toTop");

  const aoRolar = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 12);
    toTop.classList.toggle("visivel", y > 600);
  };
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduzirMovimento ? "auto" : "smooth" });
  });

  /* ------------------------------------------------------------------
     Menu mobile
     ------------------------------------------------------------------ */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");

  const fecharMenu = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("nav-aberto");
  };

  const abrirMenu = () => {
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Fechar menu");
    document.body.classList.add("nav-aberto");
  };

  navToggle.addEventListener("click", () => {
    const aberto = nav.classList.contains("is-open");
    aberto ? fecharMenu() : abrirMenu();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      fecharMenu();
      navToggle.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(e.target) || navToggle.contains(e.target)) return;
    fecharMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) fecharMenu();
  });

  /* ------------------------------------------------------------------
     Link ativo conforme a seção visível
     ------------------------------------------------------------------ */
  const linksNav = Array.from(document.querySelectorAll(".nav__link"));
  const secoes = linksNav
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && secoes.length) {
    const observadorSecoes = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          const id = "#" + entrada.target.id;
          linksNav.forEach((link) => {
            link.classList.toggle("ativo", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    secoes.forEach((secao) => observadorSecoes.observe(secao));
  }

  /* ------------------------------------------------------------------
     Revelar elementos ao rolar
     ------------------------------------------------------------------ */
  const revelaveis = document.querySelectorAll(".reveal");

  if (reduzirMovimento || !("IntersectionObserver" in window)) {
    revelaveis.forEach((el) => el.classList.add("is-visible"));
  } else {
    let observadorDisparou = false;

    const observadorReveal = new IntersectionObserver(
      (entradas) => {
        observadorDisparou = true;
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("is-visible");
          observadorReveal.unobserve(entrada.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revelaveis.forEach((el) => observadorReveal.observe(el));

    // Rede de segurança: se o navegador não disparar o observador,
    // o conteúdo nunca pode ficar invisível.
    window.setTimeout(() => {
      if (!observadorDisparou) {
        revelaveis.forEach((el) => el.classList.add("is-visible"));
      }
    }, 1200);
  }

  /* ------------------------------------------------------------------
     Galeria / lightbox
     ------------------------------------------------------------------ */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCaption = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  const itensGaleria = Array.from(document.querySelectorAll(".galeria__item"));

  let indiceAtual = 0;
  let elementoFocadoAntes = null;
  let scrollAnterior = 0;

  const fotos = itensGaleria.map((item) => {
    const img = item.querySelector("img");
    return {
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt") || "Foto da FAAM",
      legenda: item.dataset.caption || "",
    };
  });

  const atualizarLightbox = () => {
    const foto = fotos[indiceAtual];
    lbImg.src = foto.src;
    lbImg.alt = foto.alt;
    lbCaption.textContent =
      (indiceAtual + 1) + " / " + fotos.length + (foto.legenda ? " · " + foto.legenda : "");
  };

  const abrirLightbox = (indice) => {
    indiceAtual = indice;
    elementoFocadoAntes = document.activeElement;
    scrollAnterior = window.scrollY;
    atualizarLightbox();

    lightbox.hidden = false;
    document.body.style.position = "fixed";
    document.body.style.top = "-" + scrollAnterior + "px";
    document.body.style.width = "100%";

    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    lbClose.focus();

    // pré-carrega vizinhas
    [indiceAtual + 1, indiceAtual - 1].forEach((i) => {
      const foto = fotos[(i + fotos.length) % fotos.length];
      if (foto) {
        const pre = new Image();
        pre.src = foto.src;
      }
    });
  };

  const fecharLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";

    // Restaura a posição imediatamente (sem herdar o scroll suave do CSS)
    const html = document.documentElement;
    const comportamentoAnterior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, scrollAnterior);
    html.style.scrollBehavior = comportamentoAnterior;

    window.setTimeout(() => {
      lightbox.hidden = true;
      lbImg.removeAttribute("src");
      lbImg.alt = "";
      if (elementoFocadoAntes) elementoFocadoAntes.focus();
    }, reduzirMovimento ? 0 : 260);
  };

  const navegar = (passo) => {
    indiceAtual = (indiceAtual + passo + fotos.length) % fotos.length;
    atualizarLightbox();
  };

  itensGaleria.forEach((item, indice) => {
    item.addEventListener("click", () => abrirLightbox(indice));
  });

  lbClose.addEventListener("click", fecharLightbox);
  lbPrev.addEventListener("click", () => navegar(-1));
  lbNext.addEventListener("click", () => navegar(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) fecharLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;

    if (e.key === "Escape") fecharLightbox();
    if (e.key === "ArrowRight") navegar(1);
    if (e.key === "ArrowLeft") navegar(-1);

    if (e.key === "Tab") {
      const focaveis = [lbClose, lbPrev, lbNext];
      const indice = focaveis.indexOf(document.activeElement);
      e.preventDefault();
      const proximo = e.shiftKey
        ? (indice <= 0 ? focaveis.length - 1 : indice - 1)
        : (indice + 1) % focaveis.length;
      focaveis[proximo].focus();
    }
  });

  // deslizar no celular
  let toqueInicial = null;
  lightbox.addEventListener(
    "touchstart",
    (e) => {
      toqueInicial = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  lightbox.addEventListener(
    "touchend",
    (e) => {
      if (toqueInicial === null) return;
      const delta = e.changedTouches[0].clientX - toqueInicial;
      if (Math.abs(delta) > 55) navegar(delta < 0 ? 1 : -1);
      toqueInicial = null;
    },
    { passive: true }
  );

  /* ------------------------------------------------------------------
     Formulário de contato (envia pelo aplicativo de e-mail)
     ------------------------------------------------------------------ */
  const form = document.getElementById("formContato");
  const status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.classList.remove("erro");

      if (!form.checkValidity()) {
        form.reportValidity();
        status.textContent = "Por favor, preencha os campos obrigatórios.";
        status.classList.add("erro");
        return;
      }

      const dados = new FormData(form);
      const nome = String(dados.get("nome") || "").trim();
      const telefone = String(dados.get("telefone") || "").trim();
      const email = String(dados.get("email") || "").trim();
      const assunto = String(dados.get("assunto") || "").trim();
      const mensagem = String(dados.get("mensagem") || "").trim();

      const corpo = [
        "Nome: " + nome,
        "Telefone: " + (telefone || "não informado"),
        "E-mail: " + email,
        "Assunto: " + assunto,
        "",
        mensagem,
        "",
        "— Mensagem enviada pelo site da FAAM",
      ].join("\n");

      const assuntoEmail = "[Site FAAM] " + assunto + " — " + nome;
      const link =
        "mailto:secretariafaam@hotmail.com" +
        "?subject=" + encodeURIComponent(assuntoEmail) +
        "&body=" + encodeURIComponent(corpo);

      window.location.href = link;
      status.textContent =
        "Abrimos seu aplicativo de e-mail com a mensagem pronta. Se não abrir, ligue para (38) 3228-1611.";
    });
  }

  /* ------------------------------------------------------------------
     Chaves Pix: copiar ao clicar
     ------------------------------------------------------------------ */
  document.querySelectorAll(".pix__copy").forEach((botao) => {
    botao.addEventListener("click", async () => {
      const chave = botao.getAttribute("data-copy");
      let copiado = false;
      try {
        await navigator.clipboard.writeText(chave);
        copiado = true;
      } catch (_) {
        // Plano B: seleção manual + execCommand (navegadores antigos/HTTP)
        const area = document.createElement("textarea");
        area.value = chave;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try {
          copiado = document.execCommand("copy");
        } catch (_) {
          copiado = false;
        }
        document.body.removeChild(area);
      }
      if (copiado) {
        const rotulo = botao.innerHTML;
        botao.classList.add("copiado");
        botao.setAttribute("aria-live", "polite");
        botao.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg> Copiado!';
        setTimeout(() => {
          botao.classList.remove("copiado");
          botao.innerHTML = rotulo;
        }, 2200);
      } else {
        window.prompt("Copie a chave Pix (Ctrl+C):", chave);
      }
    });
  });

  /* ------------------------------------------------------------------
     Ano atual no rodapé
     ------------------------------------------------------------------ */
  const ano = document.getElementById("anoAtual");
  if (ano) ano.textContent = new Date().getFullYear();
})();
