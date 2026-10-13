# Who's The Worst? Website

A responsive, single-page website for the **Who's the Worst?** party card game.

## What's included

- `index.html`: site content and page structure
- `styles.css`: responsive layout, colors, typography, and visual styling
- `script.js`: mobile navigation and automatic copyright year

## The game's core rule

**You're voting for whoever BEST FITS THE SITUATION! Best fit = worst fit.**

One player flips and reads a situation card. Everyone can make their case, defend themselves, challenge other players, and try to turn the group before the vote. Each player places one color-coded token in front of the player they think best fits the situation. Count the tokens, record the votes on the tally board, and return the tokens to their owners before the next round. At the end, the player with the most votes is crowned **The Worst of the Worst**.

## Preview locally

You can open `index.html` directly in a browser. For a local web server, use the VS Code Live Server extension or run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Open this repository on GitHub.
2. Select **Settings**.
3. In the left menu, select **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then click **Save**.
6. Wait for the Pages build to finish. The published website URL will appear in the Pages settings.

If the repository is private, whether GitHub Pages is available depends on the account or organization plan and repository settings. You can change the repository visibility in **Settings → General** if you want a public repository, but only do that if you're comfortable making the code public.

## Customize before launch

- Replace the sample situation shown in the hero illustration with a real card from your game if desired.
- Add your official game-box artwork or logo when ready.
- Update the footer with an official contact email, social links, store link, or preorder link once those destinations exist.
- Review the final rules, player count, age recommendation, and end-of-game condition before publishing. The site currently explains the mechanics discussed so far and does not invent a player count or a fixed number of rounds.

## Technology

Plain HTML, CSS, and JavaScript. No build step, package install, or API key required.

## License

No license has been added. All rights reserved by default unless you choose to publish a license.
