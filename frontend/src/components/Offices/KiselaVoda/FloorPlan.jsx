import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * IMPORTANT:
 * For this to work without hardcoding path "d" values per floor,
 * your SVG MUST contain clickable elements with ids matching the room ids:
 *   room-1, room-2, ... room-8
 *
 * If your SVG uses different ids, update `resolveElementForRoomId`.
 */
const FloorPlan = React.memo(({ office, rooms = [], onRoomClick, statusColors = {} }) => {
  const wrapRef = useRef(null);
  const [svgText, setSvgText] = useState("");
  const [loadError, setLoadError] = useState(false);

  const getFill = useMemo(
    () => (status) => statusColors[status] || statusColors.default || "#d1d5db",
    [statusColors]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!office?.svg) {
        setSvgText("");
        return;
      }

      setLoadError(false);

      try {
        const res = await fetch(office.svg, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load SVG: ${res.status}`);
        const text = await res.text();
        if (!cancelled) setSvgText(text);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setSvgText("");
          setLoadError(true);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [office?.svg]);

  // Inject SVG markup
  useEffect(() => {
    if (!wrapRef.current) return;

    wrapRef.current.innerHTML = svgText || "";

    const svgEl = wrapRef.current.querySelector("svg");
    if (svgEl) {
      svgEl.setAttribute("width", "100%");
      svgEl.setAttribute("height", "100%");
      svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svgEl.style.width = "100%";
      svgEl.style.height = "100%";
      svgEl.style.display = "block";
    }
  }, [svgText]);

  const resolveElementForRoomId = (root, roomId) => {
    if (!root) return null;

    // Best case: id="room-1"
    let el = root.querySelector(`#${CSS.escape(roomId)}`);
    if (el) return el;

    // Alternative: data-room-id="room-1"
    el = root.querySelector(`[data-room-id="${roomId}"]`);
    if (el) return el;

    // Sometimes ids are like "Room-1" etc:
    el = root.querySelector(`[id*="${roomId}"]`);
    return el || null;
  };

  // Apply colors + click handlers
  useEffect(() => {
    if (!wrapRef.current) return;
    const root = wrapRef.current;

    rooms.forEach((room) => {
      const el = resolveElementForRoomId(root, room.id);
      if (!el) return;

      // Make it visible and clickable
      el.style.fill = getFill(room.status);
      el.style.fillOpacity = "0.5";
      el.style.transition = "fill 0.25s ease, fill-opacity 0.25s ease";
      el.style.cursor =
        room.status === "free" || room.status === "selected" ? "pointer" : "not-allowed";

      el.onmouseenter = () => {
        el.style.fillOpacity = "0.7";
      };
      el.onmouseleave = () => {
        el.style.fillOpacity = "0.5";
      };

      el.onclick = () => {
        if (room.status === "free" || room.status === "selected") {
          onRoomClick?.(room);
        }
      };
    });

    // Cleanup old handlers if rooms change
    return () => {
      rooms.forEach((room) => {
        const el = resolveElementForRoomId(root, room.id);
        if (!el) return;
        el.onclick = null;
        el.onmouseenter = null;
        el.onmouseleave = null;
      });
    };
  }, [rooms, getFill, onRoomClick]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "70%",
        overflow: "hidden",
      }}
    >
      <div
        ref={wrapRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {loadError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            padding: 16,
            textAlign: "center",
            background: "rgba(255,255,255,0.7)",
          }}
        >
          <div style={{ maxWidth: 420 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>SVG could not be loaded</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              Check that the file exists in <code>/public</code> and the name matches:
              <br />
              <code>KiselaVoda.svg</code>, <code>KiselaVoda-2.svg</code>,{" "}
              <code>KiselaVoda-3.svg</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default FloorPlan;
