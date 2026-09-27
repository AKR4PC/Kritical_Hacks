import { INFO_BLOCKS, MASTHEAD } from '../content/copy';

const INK = 'var(--ink)';

/**
 * Chapter 2 — the Victory Bulletin. A single sheet of newsprint: masthead rules,
 * a screaming headline, printed copy alternating with blacked-out lines, and a
 * photograph whose caption is doing a lot of work.
 *
 * The child order of the left column is load-bearing: the mobile stylesheet
 * targets it by nth-child to compress the sheet.
 */
export function Section3Bulletin() {
  return (
    <section
      id="section-3"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--paper)',
        alignItems: 'stretch',
        display: 'flex',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 48,
        fontFamily: 'var(--font-display)',
        overflow: 'hidden',
      }}
    >
      <div id="section-3-inner" style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* Left column — the printed sheet */}
        <div
          className="newspaper-left"
          style={{
            width: '55%',
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: `2px solid ${INK}`,
          }}
        >
          <div style={{ fontSize: '15px', letterSpacing: '4px', color: INK, marginBottom: '8px' }}>
            {MASTHEAD.paper}
          </div>
          <div style={{ fontSize: '14px', letterSpacing: '3px', color: INK, marginBottom: '4px' }}>
            {MASTHEAD.issue}
          </div>
          <div
            style={{ width: '100%', height: '2px', background: INK, marginBottom: '8px' }}
            aria-hidden="true"
          />
          <div style={{ fontSize: '14px', letterSpacing: '2px', color: INK, marginBottom: '30px' }}>
            {MASTHEAD.edition}
          </div>

          {/*
            The headline is the only block set in reverse: a black plate carrying
            red type. `fit-content` keeps the plate hugging the words instead of
            flooding the column, so the rest of the sheet stays newsprint.
          */}
          <h1
            id="s3-headline"
            style={{
              width: 'fit-content',
              maxWidth: '100%',
              padding: '0.05em 0.16em 0.07em',
              background: 'var(--black)',
              color: 'var(--red)',
              fontSize: 'clamp(48px, 6vw, 96px)',
              lineHeight: 0.9,
              marginBottom: '20px',
              overflow: 'hidden',
            }}
          >
            {MASTHEAD.headline}
          </h1>

          <div
            style={{ width: '100%', height: '1px', background: INK, marginBottom: '20px' }}
            aria-hidden="true"
          />

          <div id="s3-subhead">
            <div id="s3-subhead-title">{MASTHEAD.kicker}</div>
            <div id="s3-subhead-byline">{MASTHEAD.byline}</div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div
              style={{
                flex: 1,
                fontSize: '15px',
                lineHeight: 1.8,
                color: INK,
                letterSpacing: '1px',
              }}
            >
              {INFO_BLOCKS.map((line, i) =>
                line.truth ? (
                  <div
                    key={i}
                    className="redacted-line redacted"
                    data-truth={line.truth}
                    aria-label={`Censored line. The withheld record reads: ${line.truth}`}
                  >
                    {line.main}
                  </div>
                ) : (
                  <div key={i} className="redacted-line">
                    {line.main}
                  </div>
                )
              )}
            </div>
          </div>

          <div
            style={{
              marginTop: '30px',
              fontSize: '14px',
              letterSpacing: '3px',
              color: INK,
              borderTop: `1px solid ${INK}`,
              paddingTop: '10px',
            }}
          >
            {MASTHEAD.footer}
          </div>
        </div>

        {/* Right column — the photograph */}
        <div id="s3-photo-wrap" style={{ width: '45%', position: 'relative', overflow: 'hidden' }}>
          <img
            id="s3-photo"
            src="propaganda-img.png"
            loading="lazy"
            alt="A crowd of uniformed officers and soldiers celebrating in the street"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(100%) contrast(1.2)',
              opacity: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: INK,
              color: 'var(--paper)',
              padding: '12px 16px',
              fontSize: '15px',
              letterSpacing: '2px',
              zIndex: 10,
            }}
          >
            {MASTHEAD.caption}
          </div>
        </div>
      </div>
    </section>
  );
}
