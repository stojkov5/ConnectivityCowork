// src/components/Offices/TypeOfBooking.jsx
import React from "react";
import { Row, Col } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import "../../styles/TypeOfBooking.css";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

const TypeOfBooking = () => {
  const { t } = useTranslation();

  const { data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/plans`);
      return res.data?.plans || [];
    },
  });

  const cardData = [
    {
      key: "daily",
      title: t("typeOfBooking.daily.title"),
      icon: <CalendarOutlined />,
      description: t("typeOfBooking.daily.description"),
      defaultPrice: t("typeOfBooking.daily.price"),
      color: "#ff8c00",
      details: t("typeOfBooking.daily.details", { returnObjects: true }),
    },
    {
      key: "weekly",
      title: t("typeOfBooking.weekly.title"),
      icon: <ClockCircleOutlined />,
      description: t("typeOfBooking.weekly.description"),
      defaultPrice: t("typeOfBooking.weekly.price"),
      color: "#ff8c00",
      details: t("typeOfBooking.weekly.details", { returnObjects: true }),
    },
    {
      key: "monthly",
      title: t("typeOfBooking.monthly.title"),
      icon: <TeamOutlined />,
      description: t("typeOfBooking.monthly.description"),
      defaultPrice: t("typeOfBooking.monthly.price"),
      color: "#ff8c00",
      details: t("typeOfBooking.monthly.details", { returnObjects: true }),
    },
    {
      key: "meeting",
      title: t("typeOfBooking.meeting.title"),
      icon: <CoffeeOutlined />,
      description: t("typeOfBooking.meeting.description"),
      defaultPrice: t("typeOfBooking.meeting.price"),
      color: "#ff8c00",
      details: t("typeOfBooking.meeting.details", { returnObjects: true }),
    },
  ];

  const getPrice = (card) => {
    if (!plans || plans.length === 0) return card.defaultPrice;

    const plan = plans.find(
      (p) =>
        p.key === card.key ||
        p.type === card.key ||
        p.title === card.title ||
        p.name === card.title
    );

    return plan?.price ?? card.defaultPrice;
  };

  return (
    <section className="type-booking-scope">
      <div className="booking-container container mx-auto">
        <Row gutter={[16, 16]} justify="center">
          <Col span={22}>
            <div className="booking-header">
              <h1 className="raleway-600">{t("typeOfBooking.title")}</h1>
              <p className="raleway-300">{t("typeOfBooking.subtitle")}</p>
            </div>
            <Row gutter={[16, 16]} justify="center">
              {cardData.map((card) => (
                <Col xs={24} sm={12} md={12} lg={12} key={card.key}>
                  <div className="booking-card">
                    <div className="card-content">
                      <div className="icon" style={{ color: card.color }}>
                        {card.icon}
                      </div>

                      <h3 className="raleway-600">{card.title}</h3>

                      {/* fixed-height tag area so prices align */}
                      <div className="tag-slot">
                        <span
                          className="custom-tag raleway-300"
                          style={{ backgroundColor: card.color }}
                          title={card.description}
                        >
                          <span className="tag-text">{card.description}</span>
                        </span>
                      </div>

                      <h2 className="booking-price raleway-600">
                        {getPrice(card)}
                      </h2>

                      <ul className="raleway-300">
                        {Array.isArray(card.details) &&
                          card.details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
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
    </section>
  );
};

export default TypeOfBooking;
