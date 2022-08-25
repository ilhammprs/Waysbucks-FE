import { useContext, useState } from "react";
import Rupiah from "rupiah-format";
import { Link } from "react-router-dom";
import { UserContext } from "../context/useContext";
import { useQuery } from "react-query";
import { API } from "../components/config/api"; 
import homeCss from "../css/homeCss.module.css";
import homeLand from "../assets/land.2.png";
import Navbar from "../components/navbar/navbar";

export default function LandingPage() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(true);
  
  const [state] = useContext(UserContext); 
  let { data: products } = useQuery("productsCache", async () => {
    const response = await API.get("/products");
    return response.data.data;
  });
  return (
    <>
      <Navbar setShow={setShow} show={show} />
      <div>
        <section>
          <div className={homeCss.landing_page}>
            <div className={homeCss.reactangle}>
              <span className={homeCss.text_inside}>
                <h3>WAYSBUCKS</h3>
                <span>
                  <p className={homeCss.p1}>
                    Things are changing, but we're still here for you <br />
                  </p>
                  <br />
                  <p>
                    We have temporarily closed our in-store cafes, but select{" "}
                    <br />
                    grocery and drive-thru location remaining open.
                    <br />
                    <strong className="cssModules.>">Waysbucks</strong> Driver
                    is also available <br />
                    <br />
                    let's Orderr...
                  </p>
                </span>
              </span>
              <div>
                <img className={homeCss.pitc} src={homeLand}/>
              </div>
            </div>
          </div>
        </section>
        <section>
          <span className={homeCss.textofdown}>
            <p>Let's Order</p>
          </span>
          <div className={homeCss.landofdown}>
            {products?.map((item, index) => (
              <div className={homeCss.card} key={index}>
                <div className={homeCss.card}>
                  <Link
                    to={
                      state.isLogin === true ? `/detail/${item.id}` : ""
                    }
                    onClick={state.isLogin === false ? handleClick : ""}
                  >
                    <img
                      className={homeCss.imageP}
                      src={item.image}
                      alt=""
                    />
                  </Link>
                  <div className={homeCss.card2}>
                    <p className={homeCss.text1}>
                      {item.title.substring(0, 20)}
                    </p>
                    <p className={homeCss.text2}>
                      {Rupiah.convert(item.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
