import { Row, Col } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import "../../styles/Plans.css";

import { Link } from "react-router-dom";
const Plans = () => {
  const cardData = [
    {
      title: "DAILY ACCESS",
      icon: <CalendarOutlined />,

      price: "600 MKD / per day",
      color: "#ff8c00",
    },
    {
      title: "WEEKLY ACCESS",
      icon: <ClockCircleOutlined />,

      price: "3500 MKD / per week",
      color: "#ffb84d",
    },
    {
      title: "MONTHLY ACCESS",
      icon: <TeamOutlined />,

      price: "11000 MKD / per month",
      color: "#ff8c00",
    },
    {
      title: "MEETING ROOM",
      icon: <CoffeeOutlined />,

      price: "3000 MKD / 4h • 6000 MKD / 8h",
      color: "#ff8c00",
    },
  ];

  return (
    <div className="booking-container container mx-auto py-5">
      <div className="booking-header">
        <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-wide raleway-600">
          PLANS
        </h2>
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

                    <h2 className="booking-price raleway-600 pb-3">{card.price}</h2>
                    <Link to="/officedetails" className="booking-button rounded-full p-3">
                      <button>VIEW DETAILS</button>
                    </Link>
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

export default Plans;
