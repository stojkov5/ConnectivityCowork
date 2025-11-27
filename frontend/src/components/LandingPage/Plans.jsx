import { Row, Col } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/Plans.css";

const API_URL = import.meta.env.VITE_API_URL;

const iconMap = {
  daily: <CalendarOutlined />,
  weekly: <ClockCircleOutlined />,
  monthly: <TeamOutlined />,
  meeting: <CoffeeOutlined />,
};

const fallbackCards = [
  {
    key: "daily",
    title: "DAILY ACCESS",
    icon: <CalendarOutlined />,
    price: "600 MKD / per day",
    color: "#ff8c00",
  },
  {
    key: "weekly",
    title: "WEEKLY ACCESS",
    icon: <ClockCircleOutlined />,
    price: "3500 MKD / per week",
    color: "#ffb84d",
  },
  {
    key: "monthly",
    title: "MONTHLY ACCESS",
    icon: <TeamOutlined />,
    price: "11000 MKD / per month",
    color: "#ff8c00",
  },
  {
    key: "meeting",
    title: "MEETING ROOM",
    icon: <CoffeeOutlined />,
    price: "3000 MKD / 4h • 6000 MKD / 8h",
    color: "#ff8c00",
  },
];

const Plans = () => {
  // eslint-disable-next-line no-unused-vars
  const { data, isLoading, isError } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/plans`);
      return res.data.plans;
    },
  });

  let cardData;

  if (isError || !data || data.length === 0) {
    // Fallback to static data if backend fails / empty
    cardData = fallbackCards;
  } else {
    cardData = data.map((p) => ({
      key: p.key,
      title: p.title,
      icon: iconMap[p.key] || <CalendarOutlined />,
      price: p.price,
      color: p.color || "#ff8c00",
    }));
  }

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
            {cardData.map((card) => (
              <Col xs={24} sm={12} md={12} lg={6} key={card.key}>
                <div className="booking-card">
                  <div className="card-content">
                    <div className="icon" style={{ color: card.color }}>
                      {card.icon}
                    </div>
                    <h3 className="raleway-600">{card.title}</h3>

                    <h2 className="booking-price raleway-600 pb-3">
                      {card.price}
                    </h2>
                    <Link
                      to="/officedetails"
                      className="booking-button rounded-full p-3"
                    >
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
