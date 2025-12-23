import { Row, Col } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CoffeeOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "../../styles/Plans.css";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

const Plans = () => {
  const { t } = useTranslation();

  const iconByKey = {
    daily: <CalendarOutlined />,
    weekly: <ClockCircleOutlined />,
    monthly: <TeamOutlined />,
    meeting: <CoffeeOutlined />
  };

  const fallbackCardData = [
    { key: "daily", title: t("plans.daily.title"), price: t("plans.daily.price"), color: "#ff8c00" },
    { key: "weekly", title: t("plans.weekly.title"), price: t("plans.weekly.price"), color: "#ffb84d" },
    { key: "monthly", title: t("plans.monthly.title"), price: t("plans.monthly.price"), color: "#ff8c00" },
    { key: "meeting", title: t("plans.meeting.title"), price: t("plans.meeting.price"), color: "#ff8c00" }
  ];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/plans`);
      return res.data.plans;
    }
  });

  const plans =
    !isError && Array.isArray(data) && data.length > 0 ? data : fallbackCardData;

  return (
    <section className="plans-scope">
      <div className="booking-container container mx-auto py-5">
        <div className="booking-header text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-wide raleway-600">
            {t("plans.title")}
          </h2>
          {isLoading && <p className="text-gray-500 text-sm">{t("plans.loading")}</p>}
        </div>

        <Row gutter={[16, 16]} justify="center">
          <Col span={22}>
            <Row gutter={[16, 16]} justify="center">
              {plans.map((plan) => (
                <Col xs={24} sm={12} md={12} lg={6} key={plan.key || plan.title}>
                  <div className="booking-card">
                    <div className="card-content">
                      <div className="icon" style={{ color: plan.color || "#ff8c00" }}>
                        {iconByKey[plan.key] || <CalendarOutlined />}
                      </div>

                      <h3 className="raleway-600">{plan.title}</h3>

                      <h2 className="booking-price raleway-600 pb-3">{plan.price}</h2>

                      <Link to="/officedetails" className="booking-button rounded-full p-3">
                        <button type="button">{t("plans.viewDetails")}</button>
                      </Link>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Plans;
