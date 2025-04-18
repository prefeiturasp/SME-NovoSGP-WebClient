/*
 * This code is distributed under both CC-BY and the following ISC licence.
 *
 * Copyright 2015-2019 Jocki84
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

if (!Element.prototype.scrollIntoViewIfNeeded) {
  Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded) {
    'use strict';

    function makeRange(start, length) {
      return { start, length, end: start + length };
    }

    function coverRange(inner, outer) {
      if (
        centerIfNeeded === false ||
        (outer.start < inner.end && inner.start < outer.end)
      ) {
        return Math.max(
          inner.end - outer.length,
          Math.min(outer.start, inner.start)
        );
      }
      return (inner.start + inner.end - outer.length) / 2;
    }

    function makePoint(x, y) {
      return {
        x,
        y,
        translate: function translate(dX, dY) {
          return makePoint(x + dX, y + dY);
        },
      };
    }

    function absolute(elem, pt) {
      while (elem) {
        pt = pt.translate(elem.offsetLeft, elem.offsetTop);
        elem = elem.offsetParent;
      }
      return pt;
    }

    let target = absolute(this, makePoint(0, 0));
    const extent = makePoint(this.offsetWidth, this.offsetHeight);
    let elem = this.parentNode;
    let origin;

    while (elem instanceof HTMLElement) {
      // Apply desired scroll amount.
      origin = absolute(elem, makePoint(elem.clientLeft, elem.clientTop));
      elem.scrollLeft = coverRange(
        makeRange(target.x - origin.x, extent.x),
        makeRange(elem.scrollLeft, elem.clientWidth)
      );
      elem.scrollTop = coverRange(
        makeRange(target.y - origin.y, extent.y),
        makeRange(elem.scrollTop, elem.clientHeight)
      );

      // Determine actual scroll amount by reading back scroll properties.
      target = target.translate(-elem.scrollLeft, -elem.scrollTop);
      elem = elem.parentNode;
    }
  };
}
