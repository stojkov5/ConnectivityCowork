import { Row, Col, Card } from "antd";

const cardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
};

const cardHoverStyle = {
  transform: "translateY(-5px)",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
};

const TypeOfBooking = () => {
  const cardData = [
    {
      title: "Daily",
      description: "Book an office for a day.",
      price: "$30 per day",
      extra: "Coffee break included",
    },
    {
      title: "Weekly",
      description: "Book an office for a week.",
      price: "$150 per week",
      extra: "Coffee break included",
    },
    {
      title: "Monthly",
      description: "Book an office for a month.",
      price: "$500 per month",
      extra: "Coffee break included",
    },
  ];

  return (
    <Row gutter={[16, 16]} justify="center" align="middle" style={{ marginBottom: 40 }}>
      <Col span={22}>
        <h1 style={{ textAlign: "center", marginBottom: 24 }}>Booking Types</h1>
        <p style={{ textAlign: "center", marginBottom: 40 }}>
          You can choose one of the following booking types:
        </p>
        <Row gutter={[24, 24]} justify="center">
          {cardData.map((card, index) => (
            <Col lg={8} xs={24} key={index}>
              <div
                className="booking-card"
                style={cardStyle}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, cardHoverStyle);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, cardStyle);
                }}
              >
                <h2 style={{ marginBottom: 10 }}>{card.title}</h2>
                <p>{card.description}</p>
                <p style={{ fontWeight: "bold", margin: "10px 0" }}>{card.price}</p>
                <span style={{ color: "#52c41a" }}>{card.extra}</span>
              </div>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default TypeOfBooking;
