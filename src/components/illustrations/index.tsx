import prisonersMarkup from '../../assets/illustrations/prisoners.svg?raw';
import portraitMarkup from '../../assets/illustrations/portrait.svg?raw';

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Both illustrations are inlined rather than referenced as <img> so that their
 * thousands of paths can be measured and inked in one by one on entry. Only the
 * prisoners' geometry is unwrapped here; the portrait's markup carries its own
 * element attributes (id, viewBox, absolute positioning) and is used verbatim.
 */
const prisonersPaths = prisonersMarkup
  .replace(/^[\s\S]*?<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '');

/** Section 2: a line of prisoners, heads down, in silhouette. */
export function PrisonersArt() {
  return (
    <div id="s2-prisoners" style={{ width: '35%' }}>
      <svg
        width="100%"
        viewBox="0 0 606 340"
        fill="none"
        xmlns={SVG_NS}
        role="img"
        aria-label="A line of prisoners standing with their heads bowed"
        style={{ display: 'block', maxWidth: '100%' }}
        dangerouslySetInnerHTML={{ __html: prisonersPaths }}
      />
    </div>
  );
}

/** Section 4: the face that is watching you back. */
export function PortraitArt() {
  return <div dangerouslySetInnerHTML={{ __html: portraitMarkup }} />;
}
