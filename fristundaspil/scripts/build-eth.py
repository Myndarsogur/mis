"""Build an original, rounded block eth for the site's KN Yuanmo headings.
Requires fontTools. Only U+00F0 is supplied; the original font is unchanged.
"""
from pathlib import Path
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

pen = TTGlyphPen(None)
# Rounded bowl and a broad, curved ascender, in 1000 units per em.
pen.moveTo((335, -44))
pen.qCurveTo((48, -44), (48, 222))
pen.qCurveTo((48, 486), (286, 486))
pen.qCurveTo((367, 486), (412, 446))
pen.qCurveTo((382, 547), (282, 601))
pen.qCurveTo((212, 640), (132, 659))
pen.qCurveTo((105, 666), (123, 690))
pen.lineTo((183, 762))
pen.qCurveTo((195, 777), (221, 769))
pen.qCurveTo((595, 673), (595, 259))
pen.qCurveTo((595, -44), (335, -44))
pen.closePath()
# Counter uses the opposite winding, matching the small block-shaped apertures.
pen.moveTo((321, 145))
pen.qCurveTo((409, 145), (409, 227))
pen.lineTo((409, 256))
pen.qCurveTo((409, 320), (327, 320))
pen.qCurveTo((237, 320), (237, 249))
pen.lineTo((237, 220))
pen.qCurveTo((237, 145), (321, 145))
pen.closePath()
# Soft-ended diagonal cross stroke, visibly distinguishing eth from d.
pen.moveTo((111, 519))
pen.qCurveTo((94, 513), (88, 531))
pen.lineTo((72, 575))
pen.qCurveTo((68, 591), (85, 598))
pen.lineTo((481, 753))
pen.qCurveTo((501, 760), (507, 741))
pen.lineTo((520, 700))
pen.qCurveTo((525, 681), (507, 675))
pen.closePath()

font = FontBuilder(1000, isTTF=True)
font.setupGlyphOrder(['.notdef', 'eth'])
font.setupCharacterMap({0x00F0: 'eth'})
font.setupGlyf({'.notdef': TTGlyphPen(None).glyph(), 'eth': pen.glyph()})
font.setupHorizontalMetrics({'.notdef': (646, 0), 'eth': (646, 48)})
font.setupHorizontalHeader(ascent=1000, descent=-250)
font.setupNameTable({'familyName': 'Fristund Eth', 'styleName': 'Regular',
                    'uniqueFontIdentifier': 'FristundEth-Regular-1',
                    'fullName': 'Fristund Eth Regular', 'psName': 'FristundEth-Regular'})
font.setupOS2(sTypoAscender=1000, sTypoDescender=-250, usWinAscent=1000, usWinDescent=250)
font.setupPost()
font.setupMaxp()
font.save(Path(__file__).resolve().parents[2] / 'assets' / 'fristund-eth.ttf')
