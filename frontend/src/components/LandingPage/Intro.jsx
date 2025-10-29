import { Row, Col } from "antd";

const Features = () => {
  return (
    <section className="bg-gray-100 py-5">
      <Row
        justify="center"
        align="middle"
        className="container  mx-auto text-center raleway-300"
      >
        <Col xs={24} md={22} className=" rounded-2xl shadow-2xl p-5">
          <h1 className="text-3xl raleway-600 text-center">WELCOME</h1>
          <p className="intro-paragraph">
            Cowork Konnectivity is your gateway to a network of expanding
            coworking and office spaces in Skopje, Macedonia. Our spaces in the
            city center and Kisela Voda are hubs of creativity and productivity,
            where entrepreneurs, startups, and established companies come
            together to thrive.
          </p>
          <p className="intro-paragraph">
            At Cowork Konnectivity, we believe that an inspiring environment is
            key to success. That's why we offer a range of amenities and
            flexible membership options tailored to meet your evolving needs.
            Whether you're just starting out or looking to upgrade your
            workspace, you'll find a supportive community and a space that
            sparks innovation.
          </p>
          <p className="intro-paragraph">
            Join us at Cowork Konnectivity, where flexibility meets inspiration,
            and let your business flourish in one of our beautifully designed
            spaces.
          </p>
        </Col>
      </Row>
    </section>
  );
};

export default Features;
