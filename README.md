# Site da FAAM — Fundação Antônio Augusto de Mattos

Site institucional estático da **Fundação Antônio Augusto de Mattos (FAAM)**,
Instituição de Longa Permanência para Idosos (ILPI) sem fins lucrativos em
Coração de Jesus/MG.

Feito em HTML, CSS e JavaScript puros — sem build, sem dependências e sem
servidor. Basta publicar os arquivos no GitHub Pages.

---

## O que tem no site

- Apresentação da Fundação (missão, visão e valores)
- Cuidados oferecidos e rotina da instituição
- Galeria de fotos com ampliação (lightbox)
- Formas de ajudar: doações de itens, doações em dinheiro e voluntariado
- Transparência: dados institucionais e canal direto com a secretaria
- Contato: telefone, e-mail, endereço, mapa e formulário
- Link para o Instagram oficial
- Página 404 personalizada
- Layout responsivo (celular, tablet e computador) e acessível

---

## Estrutura de arquivos

```
faam-site/
├── index.html                  Página principal
├── 404.html                    Página de erro
├── css/
│   └── style.css               Todo o estilo do site
├── js/
│   └── main.js                 Menu, galeria, formulário e animações
├── images/
│   ├── logo.svg                Logo (fundo claro)
│   ├── logo-branco.svg         Logo (fundo escuro)
│   ├── favicon.svg             Ícone da aba do navegador
│   ├── og-image.jpg            Imagem de compartilhamento (1200×630)
│   ├── hero-principal.*        Foto principal do topo
│   ├── hero-secundaria.*       Foto secundária do topo
│   └── galeria/                Fotos da galeria (JPG + WebP)
├── robots.txt
└── .nojekyll                   Necessário para o GitHub Pages
```

> Cada foto da galeria existe em **dois formatos**: `.jpg` (compatibilidade) e
> `.webp` (mais leve). O navegador escolhe automaticamente o WebP quando
> suportado.

---

## Ver o site no computador

Dentro da pasta do projeto, rode:

```bash
python3 -m http.server 8000
```

Depois abra no navegador:

```
http://localhost:8000
```

> Abrir o `index.html` com dois cliques também funciona, mas o mapa e algumas
> fontes podem não carregar por causa das regras de segurança do navegador.
> Usar o servidor local é o jeito mais fiel de testar.

---

## Publicar no GitHub Pages

### 1. Crie o repositório

1. Entre em <https://github.com/new>.
2. Dê um nome, por exemplo `faam-site`.
3. Deixe como **Public** (o GitHub Pages gratuito exige repositório público).
4. **Não** marque para criar README, `.gitignore` ou licença.

### 2. Envie os arquivos

No terminal, dentro da pasta `faam-site`:

```bash
git init
git add .
git commit -m "Site da FAAM"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/faam-site.git
git push -u origin main
```

Troque `SEU-USUARIO` pelo seu usuário do GitHub.

### 3. Ative o GitHub Pages

1. No repositório, abra **Settings** → **Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Em **Branch**, selecione `main` e a pasta `/ (root)`.
4. Clique em **Save**.

Em alguns minutos o site estará em:

```
https://SEU-USUARIO.github.io/faam-site/
```

### 4. (Opcional) Domínio próprio

Se a Fundação tiver um domínio (ex.: `faam.org.br`), em **Settings → Pages →
Custom domain** informe o domínio e configure o DNS conforme as instruções do
GitHub. Depois atualize as URLs absolutas indicadas abaixo.

---

## Como trocar ou adicionar fotos

1. Salve a foto nova em `images/galeria/` com um nome descritivo, por exemplo
   `07-festa-junina.jpg`.
2. Gere também a versão `.webp` (mais leve). Se tiver o ImageMagick:

   ```bash
   magick 07-festa-junina.jpg -resize 1000x -quality 84 07-festa-junina.webp
   ```

3. No `index.html`, dentro da seção `<!-- Galeria -->`, copie um bloco
   `<button class="galeria__item ...">` existente e ajuste:
   - `data-caption` → legenda que aparece na ampliação
   - `aria-label` → descrição para leitores de tela
   - `srcset` e `src` → caminhos das imagens
   - `alt` → descrição da foto
   - `width` e `height` → tamanho real da imagem (evita "pulos" no layout)
4. Repita o processo nos três quadradinhos da seção do Instagram, se quiser.

> **Importante:** as fotos atuais foram obtidas das publicações públicas do
> Instagram oficial da FAAM. Antes de publicar, confirme com a Fundação que há
> autorização de uso de imagem das pessoas retratadas (especialmente dos
> idosos). Se alguma família não autorizar, remova a foto.

---

## Como adicionar PIX ou dados bancários

O site **não inventa** dados de doação. Hoje ele direciona para telefone e
e-mail. Quando a Fundação informar os dados oficiais:

1. Abra `index.html` e localize o bloco `<!-- Como ajudar -->`.
2. Dentro de `.doacao__text`, acrescente um botão ou um quadro com a chave PIX,
   por exemplo:

   ```html
   <p class="doacao__pix">
     <strong>PIX:</strong> chave-da-fundacao@exemplo.com
   </p>
   ```

3. Se quiser um QR Code, gere a imagem e salve em `images/pix-qrcode.png`,
   depois exiba com `<img src="images/pix-qrcode.png" alt="QR Code para doação via PIX">`.
4. Ajuste o estilo em `css/style.css` se necessário.

> Nunca publique dados bancários sem confirmação por escrito da diretoria da
> FAAM.

---

## Antes de publicar: checklist

- [ ] Confirmar o número de idosos acolhidos (o site mostra **51**, informado
      pela Fundação).
- [ ] Confirmar telefone, e-mail e endereço com a secretaria.
- [ ] Confirmar os dados institucionais exibidos na seção Transparência.
- [ ] Confirmar autorização de uso das fotos e da imagem dos idosos.
- [ ] Adicionar PIX/dados bancários, se a Fundação quiser receber doações
      diretamente pelo site.
- [ ] Trocar a imagem de compartilhamento (`images/og-image.jpg`) se desejar.
- [ ] Atualizar as URLs absolutas de compartilhamento (veja abaixo).

### URLs absolutas (Open Graph)

As tags `og:image` e `twitter:image` usam caminho relativo. Alguns aplicativos
(WhatsApp, Facebook) exigem URL completa. Depois de saber o endereço final do
site, troque no `<head>` do `index.html`:

```html
<meta property="og:image" content="https://SEU-USUARIO.github.io/faam-site/images/og-image.jpg">
<meta name="twitter:image" content="https://SEU-USUARIO.github.io/faam-site/images/og-image.jpg">
```

O mesmo vale para `og:url`, se você adicionar essa tag.

---

## Formulário de contato

O formulário não usa servidor: ao enviar, ele abre o aplicativo de e-mail do
visitante com a mensagem já preenchida, destinada a
`secretariafaam@hotmail.com`.

Se no futuro quiser receber as mensagens direto no site (sem depender do
e-mail), será preciso um serviço externo como Formspree, Netlify Forms ou um
backend próprio. Nesse caso, ajuste o `action` do formulário no `index.html` e
o envio no `js/main.js`.

---

## Personalização rápida

| O que mudar | Onde |
|---|---|
| Cores | `:root` no início de `css/style.css` |
| Textos e seções | `index.html` |
| Fotos | `images/` e `images/galeria/` |
| Dados institucionais | seção `#transparencia` no `index.html` |
| Mapa e localização | `iframe` na seção `#contato` do `index.html` |
| Comportamento (menu, galeria, formulário) | `js/main.js` |
| Título e descrição para o Google | `<head>` do `index.html` |

---

## Créditos

- Fotos: [Instagram oficial da FAAM](https://www.instagram.com/fundacaoantoniodemattosfaam/)
- Fontes: [Fraunces](https://fonts.google.com/specimen/Fraunces) e
  [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
- Ícones: desenhados em SVG, embutidos no próprio site
- Desenvolvimento: **jhonDev**

---

**FAAM — Fundação Antônio Augusto de Mattos**
Rua João Lafetá, 220 — Centro · Coração de Jesus/MG · CEP 39340-000
Telefone: (38) 3228-1611 · E-mail: secretariafaam@hotmail.com
CNPJ 08.850.114/0001-32

> “Ame o seu próximo como a si mesmo.”
