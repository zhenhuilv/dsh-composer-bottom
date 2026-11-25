// Client half of @local/composer-bottom.
//
// Injects one <style> element through the root-scoped `conversation.hero.frame`
// hoc slot, which the Conversation mounts around its scroll body in every
// phase. Unloading or disabling the plugin unmounts the slot occupant, React
// removes the <style>, and the stock centered hero layout is restored
// automatically — no persistent DOM or stylesheet mutation is left behind.

window.__ModuleLoader__.load({
  id: 'dsh-composer-bottom',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const cssText = `
/* @local/composer-bottom — dock the home (hero) composer card at the column
   floor and float the brand block (fish logo + headline) mid-column, matching
   where the stock centered hero painted it. Scoped to the main conversation's
   hero phase only: active, settling, and embedded occurrences keep the stock
   layout. Stable host contracts are used for anchors: [data-phase] on the
   conversation root, [data-composer-seat] on the seat, [data-composer-card]
   on the input card, [data-composer-input] on the draft surface,
   [data-composer-dock] on the statistics row, and the slots runtime's
   [data-chain-overlay-fallback] anchor around the resident composer stack. */

/* 1. Let the composer seat fill the hero column: the brand block then floats
      in the seat's free space while the input card hugs the floor. */
[data-phase='hero'] [data-composer-seat] {
  flex: 1 1 auto !important;
}

/* 2. Flatten the hero composer stack. The slots runtime wraps the chain in
      display:contents anchors (div[data-slot], div[data-chain-overlay-
      fallback]), so the stack is already the seat's only box-level flex item;
      flattening it promotes its children (brand block, workspace chip row,
      input docks, composer card) to seat flex items that can be placed
      independently. Display-only change — the DOM tree is untouched, so
      switching phases or removing this plugin restores the stock stack. */
[data-phase='hero'] [data-composer-seat] [data-chain-overlay-fallback] > div:first-child {
  display: contents !important;
}

/* 3. Brand block (the flattened stack's first child): auto margins center it
      in the free space between the column top and the docked card, i.e. its
      stock centered-hero position. */
[data-phase='hero'] [data-composer-seat] [data-chain-overlay-fallback] > div:first-child > div:first-child {
  flex: none !important;
  height: auto !important;
  margin-top: auto !important;
  margin-bottom: auto !important;
}

/* 4. Workspace chip row (second child): restore the hero stack's width axis
      and 12px rhythm above the card, and keep the chip (and its picker menu)
      above the card. */
[data-phase='hero'] [data-composer-seat] [data-chain-overlay-fallback] > div:first-child > div:nth-child(2) {
  flex: none !important;
  position: relative !important;
  z-index: 10 !important;
  align-self: center !important;
  width: min(calc(var(--dsh-composer-card-max-width) + 2 * var(--dsh-composer-side-clearance)), 100%) !important;
  margin-top: 12px !important;
}

/* 5. Docked-card geometry — replicate the active composer exactly, so the
      card neither moves nor resizes when the first message starts a session:
      - the bar root gets the composer variant's 4px bottom pad
        (stock: .root:not(.hero) padding 0 clearance 4px; the hero variant
        drops it). The bar root is the only div that owns the card as a direct
        child, expressed with :has over the card's stable attribute;
      - the statistics dock row (stock: .root:not(.hero) > .dock) reserves
        its 22px min-height + 4px top pad even while empty — the hero variant
        hides it via .hero .dock:empty, which these rules override. */
[data-phase='hero'] [data-composer-seat] div:has(> [data-composer-card]) {
  padding-bottom: 4px !important;
}

[data-phase='hero'] [data-composer-seat] [data-composer-dock] {
  display: flex !important;
  min-height: calc(22px + var(--dsh-content-font-delta-secondary, 0px)) !important;
}

/* 6. Chip row to card: the stock hero stack's 8px gap (the slots runtime's
      contents anchors sit between them and carry no box, so the gap is
      restored on the row itself). */
[data-phase='hero'] [data-composer-seat] [data-chain-overlay-fallback] > div:first-child > div:nth-child(2) {
  margin-bottom: 8px !important;
}

/* 7. Draft surface height — the hero variant floors the empty draft at 52px
      (two lines) while the docked composer uses 36px (one line), which makes
      the home card taller than the active card. Use the active floor so the
      card height matches exactly. */
[data-phase='hero'] [data-composer-card] [data-composer-input] {
  min-height: 36px !important;
}

/* 8. Placeholder — the hero variant clamps it to two lines; with the 36px
      floor it must match the docked composer's single-line ellipsis. The
      placeholder is the editable surface's adjacent sibling. */
[data-phase='hero'] [data-composer-card] [data-composer-input] + * {
  display: block !important;
  white-space: nowrap !important;
  -webkit-line-clamp: unset !important;
  line-clamp: unset !important;
}
`;

    /**
     * Hero frame layer: renders the stylesheet plus the wrapped scroll body
     * untouched, so the scroll body stays a direct flex item of the column.
     * Non-hero frames (active, settling, embedded occurrences) render the
     * children only, so those trees carry no duplicate stylesheet.
     */
    function BottomHeroFrame(props) {
      if (!props.hero) return props.children;
      return h(
        React.Fragment,
        null,
        h('style', null, cssText),
        props.children,
      );
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('conversation.hero.frame', () => ctx.slots.register({
          name: 'conversation.hero.frame',
          id: 'composer-bottom',
          order: 5,
        }, BottomHeroFrame));
      },
    };
  },
});
