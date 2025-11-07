/* eslint-disable no-unused-vars */
import { Row, Col } from "antd";
import { motion } from "framer-motion";
import "../../styles/Intro.css";

const Intro = () => {
  return (
    <section className=" py-5">
      <Row justify="center" align="middle" className="container mx-auto raleway-300 ">
        <Col xs={24} md={24} lg={24}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-10 text-center relative overflow-hidden "
          >
          

            <h1 className="text-4xl md:text-5xl raleway-600 text-orange-500 mb-6 tracking-wide">
              WELCOME
            </h1>

            <p className="intro-paragraph mb-5 text-gray-700 ">
              <strong className="text-black">Cowork Konnectivity</strong> is
              your gateway to a network of expanding coworking and office spaces
              in Skopje, Macedonia. Our spaces in the city center and Kisela
              Voda are hubs of creativity and productivity, where entrepreneurs,
              startups, and established companies come together to thrive.
            </p>

            <p className="intro-paragraph mb-5 text-gray-700 leading-relaxed">
              At{" "}
              <span className="text-orange-500 font-semibold">
                Cowork Konnectivity
              </span>
              , we believe that an inspiring environment is key to success. We
              offer a range of amenities and flexible membership options
              tailored to meet your evolving needs. Whether you're just starting
              out or looking to upgrade your workspace, you'll find a supportive
              community and a space that sparks innovation.
            </p>

            <p className="intro-paragraph text-gray-700 leading-relaxed">
              Join us where{" "}
              <span className="text-orange-500 font-semibold">
                flexibility meets inspiration
              </span>
              , and let your business flourish in one of our beautifully
              designed spaces.
            </p>
          </motion.div>
        </Col>
      </Row>
    </section>
  );
};

export default Intro;
