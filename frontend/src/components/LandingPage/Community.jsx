import { Row, Col, Image } from "antd";

const Community = () => {
  return (
    <section id="community" className="py-4 bg-gray-100 raleway-300">
      <Row
        justify="center"
        align="middle"
        className="container mx-auto text-center"
      >
        <Col xs={24} md={22} className=" rounded-2xl shadow-2xl p-5">
          <h2 className="text-3xl raleway-600 mb-6">OUR COMMUNITY</h2>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <p className="text-2xl intro-paragraph">
                We believe in providing value beyond workspace – we're building
                a community that fosters collaboration, creativity, and growth.
                Whether you're a solopreneur, freelancer, or a growing team,
                Konnectivity Coworking Space has a solution that fits.
              </p>
            </Col>
            <Col span={8}>
              <Image
                className="w-full rounded-2xl"
                src="/Images/2.webp"
                alt=""
              />
            </Col>
            <Col span={8}>
              <Image
                className="w-full rounded-2xl"
                src="/Images/3.webp"
                alt=""
              />
            </Col>
            <Col span={8}>
              <Image
                className="w-full rounded-2xl"
                src="/Images/4.webp"
                alt=""
              />
            </Col>
            <Col xs={24}>
              <p className="text-2xl intro-paragraph py-5">
                To take advantage of this exclusive offer or to learn more about
                our membership options, please contact our team at
                coworkonnectivity@gmail.com . We would be delighted to answer
                any questions you have and guide you through the enrollment
                process.
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default Community;
