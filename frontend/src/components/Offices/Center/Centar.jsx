import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DatePicker, Select, Button, Alert, Tag, Row, Col, Modal } from "antd";
import FloorPlan from "./FloorPlan";
import ControlPanel from "./ControlPanel";

const statusColors = { free: "#00ff00", taken: "#ff0000" };
const timeSlots = ["08:00 - 16:00", "16:00 - 00:00"];

const offices = [
  {
    id: "centar",
    name: "Centar-First Floor",
    image: "/Centar.svg",
    viewBox: "0 0 893 588",
    seats: [
      { id: "seat-1", name: "Seat 1" },
      { id: "seat-2", name: "Seat 2" },
      { id: "seat-3", name: "Seat 3" },
      { id: "seat-4", name: "Seat 4" },
      { id: "seat-5", name: "Seat 5" },
      { id: "seat-6", name: "Seat 6" },
    ],
    getPathD: (id) =>
      ({
        "seat-1":
          "M476.802 181.96C472.759 158.373 482.98 144.613 488.596 140.682C502.749 142.03 518.642 146.86 524.82 149.106C516.396 150.791 508.814 189.542 513.026 192.911C516.396 195.607 490.281 186.734 476.802 181.96Z",
        "seat-2":
          "M526.15 281.438C503.844 272.768 497.305 256.924 496.824 250.086C505.262 238.644 517.582 227.502 522.687 223.36C519.797 231.451 549.122 257.891 554.179 256.013C558.224 254.511 537.178 272.337 526.15 281.438Z",
        "seat-3":
          "M637.168 289.143C618.217 303.757 601.273 301.164 595.171 298.041C589.738 284.904 586.567 268.598 585.661 262.087C591.093 268.743 628.886 257.306 629.892 252.007C630.697 247.767 635.078 274.998 637.168 289.143Z",
        "seat-4":
          "M699.579 196.062C704.029 219.576 694.047 233.51 688.5 237.538C674.327 236.435 658.352 231.88 652.136 229.741C660.53 227.911 667.441 189.035 663.171 185.739C659.755 183.102 686.02 191.522 699.579 196.062Z",
        "seat-5":
          "M649.753 96.0498C671.991 104.89 678.408 120.784 678.837 127.626C670.312 139.002 657.907 150.05 652.771 154.152C655.723 146.085 626.6 119.42 621.529 121.259C617.473 122.73 638.654 105.066 649.753 96.0498Z",
        "seat-6":
          "M539.379 89.0455C557.691 73.638 574.729 75.5063 580.96 78.3663C586.947 91.2603 590.81 107.416 591.993 113.882C586.282 107.464 549.011 120.501 548.232 125.838C547.608 130.108 542.07 103.089 539.379 89.0455Z",
      }[id] || ""),
  },
  {
    id: "centar2",
    name: "Centar-Gallery ",
    image: "/Centar2.svg",
    viewBox: "0 0 860 564",
    seats: [
      { id: "seat-1", name: "Seat 1" },
      { id: "seat-2", name: "Seat 2" },
      { id: "seat-3", name: "Seat 3" },
      { id: "seat-4", name: "Seat 4" },
      { id: "seat-5", name: "Seat 5" },
      { id: "seat-6", name: "Seat 6" },
    ],
    getPathD: (id) =>
      ({
        "seat-1":
          "M103 283V264H147.5V295C146.3 300.2 137 303.5 132.5 304.5H119C114.333 303.167 104.8 299.4 104 295C103.2 290.6 103 285.167 103 283Z",
        "seat-2":
          "M172 283V264H216.5V295C215.3 300.2 206 303.5 201.5 304.5H188C183.333 303.167 173.8 299.4 173 295C172.2 290.6 172 285.167 172 283Z",
        "seat-3":
          "M240 283V264H284.5V295C283.3 300.2 274 303.5 269.5 304.5H256C251.333 303.167 241.8 299.4 241 295C240.2 290.6 240 285.167 240 283Z",
        "seat-4":
          "M284.5 133.5L284.5 152.5L240 152.5L240 121.5C241.2 116.3 250.5 113 255 112L268.5 112C273.167 113.333 282.7 117.1 283.5 121.5C284.3 125.9 284.5 131.333 284.5 133.5Z",
        "seat-5":
          "M216.5 133.5L216.5 152.5L172 152.5L172 121.5C173.2 116.3 182.5 113 187 112L200.5 112C205.167 113.333 214.7 117.1 215.5 121.5C216.3 125.9 216.5 131.333 216.5 133.5Z",
        "seat-6":
          "M148.5 133.5L148.5 152.5L104 152.5L104 121.5C105.2 116.3 114.5 113 119 112L132.5 112C137.167 113.333 146.7 117.1 147.5 121.5C148.3 125.9 148.5 131.333 148.5 133.5Z",
      }[id] || ""),
  },
];

const Center = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showOverview, setShowOverview] = useState(false);
  const [activeOfficeId, setActiveOfficeId] = useState("centar");

  const { data: reservations = [] } = useQuery({
    queryKey: ["centerReservations"],
    queryFn: () =>
      JSON.parse(localStorage.getItem("centerReservations") || "[]"),
  });

  const saveReservations = (data) => {
    localStorage.setItem("centerReservations", JSON.stringify(data));
    queryClient.setQueryData(["centerReservations"], data);
  };

  const addReservation = useMutation({
    mutationFn: (newRes) => [...reservations, newRes],
    onSuccess: saveReservations,
  });

  const deleteReservation = useMutation({
    mutationFn: (resToDelete) =>
      reservations.filter(
        (r) =>
          !(
            r.officeId === resToDelete.officeId &&
            r.seatId === resToDelete.seatId &&
            r.date === resToDelete.date &&
            r.slot === resToDelete.slot
          )
      ),
    onSuccess: saveReservations,
  });

  const activeOffice = useMemo(
    () => offices.find((o) => o.id === activeOfficeId),
    [activeOfficeId]
  );

  const seatsWithStatus = useMemo(() => {
    return activeOffice.seats.map((seat) => {
      if (!selectedDate) return { ...seat, status: "free", bookedSlots: [] };
      const booked = reservations.filter(
        (r) =>
          r.seatId === seat.id &&
          r.officeId === activeOffice.id &&
          r.date === selectedDate.format("YYYY-MM-DD")
      );
      return {
        ...seat,
        status: booked.length >= 2 ? "taken" : "free",
        bookedSlots: booked.map((r) => r.slot),
      };
    });
  }, [activeOffice, selectedDate, reservations]);

  const handleSeatClick = (seat) => {
    if (!selectedDate) return alert("Select a date first");
    setSelectedSeat(seat);
    setSelectedSlot("");
  };

  const handleReserve = () => {
    if (!selectedSeat || !selectedSlot || !selectedDate) return;

    const duplicate = reservations.find(
      (r) =>
        r.seatId === selectedSeat.id &&
        r.officeId === activeOffice.id &&
        r.date === selectedDate.format("YYYY-MM-DD") &&
        r.slot === selectedSlot
    );
    if (duplicate)
      return alert("This seat is already reserved for that time slot.");

    const newReservation = {
      officeId: activeOffice.id,
      seatId: selectedSeat.id,
      seatName: selectedSeat.name,
      date: selectedDate.format("YYYY-MM-DD"),
      slot: selectedSlot,
      createdAt: new Date().toISOString(),
    };

    addReservation.mutate(newReservation, {
      onSuccess() {
        setSelectedSeat(null);
        setSelectedSlot("");
      },
    });
  };

  const availableSlots = useMemo(() => {
    if (!selectedSeat || !selectedDate) return [];
    const booked = reservations
      .filter(
        (r) =>
          r.seatId === selectedSeat.id &&
          r.officeId === activeOffice.id &&
          r.date === selectedDate.format("YYYY-MM-DD")
      )
      .map((r) => r.slot);
    return timeSlots.filter((slot) => !booked.includes(slot));
  }, [selectedSeat, selectedDate, reservations, activeOffice]);

  return (
    <Row justify="center" className="raleway-300">
      <Col span={22}>
        <div style={{ margin: "3rem auto", maxWidth: "1200px" }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={6}>
              <ControlPanel
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                activeOfficeId={activeOfficeId}
                setActiveOfficeId={setActiveOfficeId}
                offices={offices}
                showOverview={showOverview}
                setShowOverview={setShowOverview}
                seatsWithStatus={seatsWithStatus}
                reservations={reservations}
                activeOffice={activeOffice}
                deleteReservation={deleteReservation.mutate}
              />
            </Col>
            <Col xs={24} md={18}>
              <FloorPlan
                office={activeOffice}
                seats={seatsWithStatus}
                onSeatClick={handleSeatClick}
                statusColors={statusColors}
              />
            </Col>
          </Row>

          <Modal
            title={`Reserve ${selectedSeat?.name}`}
            open={!!selectedSeat}
            onCancel={() => {
              setSelectedSeat(null);
              setSelectedSlot("");
            }}
            onOk={handleReserve}
            okButtonProps={{ disabled: !selectedSlot }}
            okText="Reserve"
            destroyOnHidden
          >
            <Select
              value={selectedSlot}
              onChange={setSelectedSlot}
              style={{ width: "100%" }}
              placeholder="Select time slot"
              options={availableSlots.map((s) => ({ value: s, label: s }))}
            />
            {selectedSeat?.bookedSlots?.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <span>Booked slots:</span>
                {selectedSeat.bookedSlots.map((slot) => (
                  <Tag color="red" key={slot} style={{ marginLeft: 5 }}>
                    {slot}
                  </Tag>
                ))}
              </div>
            )}
          </Modal>
        </div>
      </Col>
    </Row>
  );
};

export default Center;
