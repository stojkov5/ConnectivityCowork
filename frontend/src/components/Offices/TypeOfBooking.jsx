import { Row, Col, Card, Tag } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";

const TypeOfBooking = () => {
  const cardData = [
    {
      title: "Daily Access",
      icon: <CalendarOutlined style={{ fontSize: 28, color: "#1890ff" }} />,
      description: "Flexible solution for one day.",
      price: "600 MKD / per day",
      color: "#1890ff",
      details: [
        "Flexible workspace solutions tailored to your needs.",
        "High-speed internet and secure network access.",
        "Access to meeting rooms and event spaces.",
        "Free coffee and refreshing beverages.",
        "Networking events and professional development opportunities.",
        "24/7 access to boost productivity according to your schedule.",
        "Color printer and office supplies.",
        "Ergonomic furniture.",
        "Dedicated desk space.",
        "Private locker.",
      ],
    },
    {
      title: "Weekly Access",
      icon: <ClockCircleOutlined style={{ fontSize: 28, color: "#52c41a" }} />,
      description: "7 flexible daily entries during the month.",
      price: "3500 MKD / per week",
      color: "#52c41a",
      details: [
        "Flexible workspace solutions tailored to your needs.",
        "High-speed internet and secure network access.",
        "Access to meeting rooms and event spaces.",
        "Free coffee and refreshing beverages.",
        "Networking events and professional development opportunities.",
        "24/7 access to boost productivity according to your schedule.",
        "Color printer and office supplies.",
        "Ergonomic furniture.",
        "Dedicated desk space.",
        "Private locker.",
      ],
    },
    {
      title: "Monthly Access",
      icon: <TeamOutlined style={{ fontSize: 28, color: "#722ed1" }} />,
      description: "Full coworking access for a month.",
      price: "11000 MKD / per month",
      color: "#722ed1",
      details: [
        "Flexible workspace solutions tailored to your needs.",
        "High-speed internet and secure network access.",
        "Access to meeting rooms and event spaces.",
        "Free coffee and refreshing beverages.",
        "Networking events and professional development opportunities.",
        "24/7 access to boost productivity according to your schedule.",
        "Color printer and office supplies.",
        "Ergonomic furniture.",
        "Dedicated desk space.",
        "Private locker.",
      ],
    },
    {
      title: "Meeting Room",
      icon: <CoffeeOutlined style={{ fontSize: 28, color: "#fa8c16" }} />,
      description: "Professional meeting environment (10–15 people).",
      price: "3000 MKD / 4h • 6000 MKD / 8h",
      color: "#fa8c16",
      details: [
        "Presentation screen, HDMI cables.",
        "Markers and whiteboard.",
        "Wi-Fi connection.",
        "Kitchen access, coffee/tea.",
        "Printer.",
        "Private offices for 1–8 people.",
        "Private parking for up to 60 vehicles.",
      ],
    },
  ];

  return (
    <Row justify="center" style={{ marginBottom: 60, padding: "0 20px" }}>
      <Col span={24} style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "600", marginBottom: 10 }}>
          Connectivity – Cowork Pricing
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>
          Choose the booking option that fits your work style:
        </p>
      </Col>

      <Row gutter={[24, 24]} justify="center" style={{ maxWidth: 1200 }} className="raleway-300" >
        {cardData.map((card, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card
              hoverable
              bordered={false}
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                height: "100%",
              }}
              bodyStyle={{ padding: "24px 28px" }}
            >
              <div style={{ marginBottom: 16 }}>{card.icon}</div>
              <h2 style={{ color: card.color, fontWeight: "600" }}>
                {card.title}
              </h2>
              <p style={{ color: "#555", marginBottom: 10 }}>{card.description}</p>
              <Tag color={card.color} style={{ fontSize: 15, marginBottom: 15 }}>
                {card.price}
              </Tag>
              <ul
                style={{
                  textAlign: "left",
                  paddingLeft: 20,
                  color: "#555",
                  lineHeight: 1.7,
                  fontSize: 14,
                }}
              >
                {card.details.map((item, i) => (
                  <li className="list-disc" key={i}>{item}</li>
                ))}
              </ul>
            </Card>
          </Col>
        ))}
      </Row>
    </Row>
  );
};

export default TypeOfBooking;
