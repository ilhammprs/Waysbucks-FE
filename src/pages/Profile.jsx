import React from "react";
import { Container } from "react-bootstrap";
import Navbar from "../components/navbar/navbar";
import ModalProfile from "../components/modal/Profile";
import { UserContext } from "../context/useContext";
import { useContext } from "react";
import Rupiah from "rupiah-format";
import { API } from "../components/config/api";
import { useQuery } from "react-query";
import QR from "react-qr-code";
import PhotoProfile from "../assets/Rectangle 12.png";
import Logo from "../assets/Logo.svg";

export default function Profile() {
  const [state] = useContext(UserContext);

  let { data: ProfileTransactions } = useQuery(
    "transactionsCache",
    async () => {
      const response = await API.get("/transaction-user");
      return response.data.data;
    }
  );

  let { data: Profile } = useQuery("profileCache", async () => {
    const response = await API.get("/profile-user");
    return response.data.data.profile;
  });

  return (
    <>
      <Navbar />
      <Container className="profileContainer">
        <div className="profileLeft">
          <h1>My Profile</h1>
          <div className="data">
            <img src={PhotoProfile} alt="Profile" />
            <ul>
              <li className="dataTitle">Full name</li>
              <li className="dataContent">{state.user.name}</li>
              <li className="dataTitle">Email</li>
              <li className="dataContent">{state.user.email}</li>
            </ul>
          </div>
          <ModalProfile />
        </div>

        <div className="profileRight">
          <h1>My Transaction</h1>
          {ProfileTransactions?.map((item, index) => (
            <div
              className={item?.status === "" ? "fd" : "profileCard mb-5"}
              key={index}
            >
              <div className="contentCardLeft">
                {item?.carts?.map((cart, idx) => (
                  <div className="mapContent" key={idx}>
                    <img
                      src={
                        "http://localhost:5000/uploads/" + cart?.product?.image
                      }
                      alt="coffee"
                    />
                    <ul>
                      <li className="profileCardTitle">
                        {cart?.product?.title}
                      </li>
                      <li className="profileCardDate">
                        <strong>Saturday</strong>,20 Oktober 2022
                      </li>
                      <li className="profileCardToping">
                        <strong className="inline">
                          Toping :{" "}
                          {cart.topping.map((topping, idx) => (
                            <span key={idx}>{topping?.title},</span>
                          ))}
                        </strong>
                      </li>
                      <li className="profileCardPrice">
                        Price: {Rupiah.convert(cart?.product?.price)}
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
              <div
                className={
                  item?.status === "Success"
                    ? "contentCardRight Success"
                    : item?.status === "Cancel"
                    ? "contentCardRight Cancel"
                    : "contentCardRight Otw"
                }
              >
                <img src={Logo} alt="logo" />

                <QR value="git re" bgColor="transparent" size={80} />
                <span>
                  <p>{item?.status}</p>
                </span>
                <p className="profileSubTotal">
                  Sub Total : {Rupiah.convert(item?.total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
