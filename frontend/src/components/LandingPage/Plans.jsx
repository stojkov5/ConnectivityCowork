import { Row, Col } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "../../styles/Plans.css";

const API_URL = import.meta.env.VITE_API_URL;

const iconByKey = {
  daily: <CalendarOutlined />,
  weekly: <ClockCircleOutlined />,
  monthly: <TeamOutlined />,
  meeting: <CoffeeOutlined />,
};

// Fallback data if API fails or collection is empty
const fallbackCardData = [
  {
    key: "daily",
    title: "DAILY ACCESS",
    price: "600 MKD / per day",
    color: "#ff8c00",
  },
  {
    key: "weekly",
    title: "WEEKLY ACCESS",
    price: "3500 MKD / per week",
    color: "#ffb84d",
  },
  {
    key: "monthly",
    title: "MONTHLY ACCESS",
    price: "11000 MKD / per month",
    color: "#ff8c00",
  },
  {
    key: "meeting",
    title: "MEETING ROOM",
    price: "3000 MKD / 4h • 6000 MKD / 8h",
    color: "#ff8c00",
  },
];

const Plans = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/plans`);
      return res.data.plans;
    },
  });

  const plans =
    !isError && Array.isArray(data) && data.length > 0
      ? data
      : fallbackCardData;

  return (
    <div className="booking-container container mx-auto py-5">
      <div className="booking-header">
        <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-wide raleway-600">
          PLANS
        </h2>
        {isLoading && (
          <p className="text-gray-500 text-sm">Loading latest prices...</p>
        )}
      </div>

      <Row gutter={[16, 16]} justify="center">
        <Col span={22}>
          <Row gutter={[16, 16]} justify="center">
            {plans.map((plan) => (
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={6}
                key={plan.key || plan.title}
              >
                <div className="booking-card">
                  <div className="card-content">
                    <div
                      className="icon"
                      style={{ color: plan.color || "#ff8c00" }}
                    >
                      {iconByKey[plan.key] || <CalendarOutlined />}
                    </div>

                    <h3 className="raleway-600">
                      {plan.title || "PLAN"}
                    </h3>

                    <h2 className="booking-price raleway-600 pb-3">
                      {plan.price}
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
