import { Row, Col } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import "../../styles/TypeOfBooking.css";

const TypeOfBooking = () => {
  const cardData = [
    {
      title: "DAILY ACCESS",
      icon: <CalendarOutlined />,
      description: "Flexible solution for one day.",
      price: "600 MKD / per day",
      color: "#ff8c00",
      details: [
        "Flexible workspace solutions tailored to your needs.",
        "High-speed internet and secure network access.",
        "Access to meeting rooms and event spaces.",
        "Free coffee and refreshing beverages.",
        "24/7 access to boost productivity.",
      ],
    },
    {
      title: "WEEKLY ACCESS",
      icon: <ClockCircleOutlined />,
      description: "7 flexible daily entries during the month.",
      price: "3500 MKD / per week",
      color: "#ffb84d",
      details: [
        "Flexible workspace for your weekly schedule.",
        "Networking events and development opportunities.",
        "Access to printer and supplies.",
        "Ergonomic furniture.",
        "Private locker.",
      ],
    },
    {
      title: "MONTHLY ACCESS",
      icon: <TeamOutlined />,
      description: "Full coworking access for a month.",
      price: "11000 MKD / per month",
      color: "#ff8c00",
      details: [
        "Unlimited coworking access.",
        "All amenities included.",
        "24/7 entry.",
        "Community support.",
        "Private meeting rooms.",
      ],
    },
    {
      title: "MEETING ROOM",
      icon: <CoffeeOutlined />,
      description: "Professional meeting environment (10–15 people).",
      price: "3000 MKD / 4h • 6000 MKD / 8h",
      color: "#ff8c00",
      details: [
        "Presentation screen & HDMI.",
        "Whiteboard & markers.",
        "Wi-Fi connection.",
        "Coffee/tea included.",
        "Private parking available.",
      ],
    },
  ];

  return (
    <div className="booking-container container mx-auto">
      <div className="booking-header">
        <h1 className="raleway-600">Connectivity – Cowork Pricing</h1>
        <p className="raleway-300">Choose the booking option that fits your work style:</p>
      </div>

      <Row gutter={[16, 16]} justify="center">
        <Col span={22}>
          <Row gutter={[16, 16]} justify="center">
            {cardData.map((card, index) => (
              <Col xs={24} sm={12} md={12} lg={6} key={index}>
                <div className="booking-card">
                  <div className="card-content">
                    <div className="icon" style={{ color: card.color }}>
                      {card.icon}
                    </div>
                    <h3 className="raleway-600">{card.title}</h3>

                    {/* ✅ Custom Tag */}
                    <span
                      className="custom-tag raleway-300"
                      style={{ backgroundColor: card.color }}
                    >
                      <span className="tag-icon">{card.icon}</span>
                      {card.description}
                    </span>

                    <h2 className="booking-price raleway-600">{card.price}</h2>

                    <ul className="raleway-300">
                      {card.details.map((detail, detailIndex) => (
                        <li key={detailIndex}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default TypeOfBooking;
