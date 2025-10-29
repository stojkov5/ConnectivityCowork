import React from "react";
import { Row, Col, Image } from "antd";

const Coffee = () => {
  return (
    <section className="bg-gray-100 py-5">
      <Row
        justify="center"
        align="middle"
        className="container mx-auto text-center raleway-300"
      >
        {/* Text Section */}
        <Col xs={24} md={22} className=" rounded-2xl shadow-2xl p-5">
          <h2 className="text-3xl raleway-600 mb-6">
            WE MAKE SHURE YOU NEVER RUN OUT OF FUEL
          </h2>
          <p className="intro-paragraph mb-6">
            We understand that the daily grind can be tough, and sometimes all
            you need is a delicious cup of coffee to keep you going. You can
            craft your perfect brew, whether you prefer a bold espresso shot or
            a creamy latte. We take pride in ensuring that your caffeine fix is
            always within reach.
          </p>
          <Image src="/Images/Coffee.webp" className="rounded-2xl" />
        </Col>
      </Row>
    </section>
  );
};

export default Coffee;
