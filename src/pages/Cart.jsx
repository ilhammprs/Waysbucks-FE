import React, { useState } from "react";
import Rupiah from "rupiah-format";
import { useEffect } from "react";
import cartCss from "../css/styleCss.module.css";
import trash from "../assets/trash.svg";
import ModalCart from "../components/modal/Cart";
import Navbar from "../components/navbar/navbar";
import { useMutation, useQuery } from "react-query";
import { API } from "../components/config/api";
import { useContext } from "react";
import { UserContext } from "../context/useContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [state, dispatch] = useContext(UserContext);
  const [showTrans, setShowTrans] = useState(false);
  const handleClose = () => setShowTrans(false);
  let navigate = useNavigate();

  // cart
  let { data: cart, refetch } = useQuery("cartsCache", async () => {
    const response = await API.get("/carts-id");
    return response.data.data;
  });

  //total
  let resultTotal = cart?.reduce((a, b) => {
    return a + b.subtotal;
  }, 0);

  //hapus
  let handleDelete = async (id) => {
    await API.delete(`/cart/` + id);
    refetch();
  };

  //pay
  const form = {
    status: "success",
    total: 1111,
  };
  const handleSubmit = useMutation(async (e) => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    // Insert transaction data
    const body = JSON.stringify(form);

    const response = await API.patch("/transaction", body, config);

    const token = response.data.token;

    window.snap.pay(token, {
      onSuccess: function (result) {
        /* You may add your own implementation here */
        console.log(result);
        navigate("/profile");
      },
      onPending: function (result) {
        /* You may add your own implementation here */
        console.log(result);
        navigate("/profile");
      },
      onError: function (result) {
        /* You may add your own implementation here */
        console.log(result);
      },
      onClose: function () {
        /* You may add your own implementation here */
        alert("you closed the popup without finishing the payment");
      },
    });
  });

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className={cartCss.container}>
        <section>
          <p className={cartCss.titlePage}>My Cart</p>
          <p className={cartCss.subtitlePage}>Review Your Order</p>
          <div className={cartCss.wrap}>
            <div className={cartCss.wrap}>
              <div className={cartCss.left}>
                {cart?.map((item, index) => (
                  <div className={cartCss.product} key={index}>
                    <img
                      src={item?.product?.image}
                      className={cartCss.imgProduct}
                      alt="cartimage"
                    />
                    <div className={cartCss.con_wrap}>
                      <span className={cartCss.tex_left}>
                        <p>{item.product.title}</p>
                        <p>{Rupiah.convert(item?.subtotal)}</p>
                      </span>
                      <span className={cartCss.tex_left1}>
                        <p>
                          Toping :{" "}
                          <span>
                            {" "}
                            {item.topping?.map((topping, idx) => (
                              <span className="d-inline" key={idx}>
                                {topping.title},
                              </span>
                            ))}
                          </span>
                        </p>
                        <img
                          src={trash}
                          onClick={() => handleDelete(item.id)}
                          alt="#"
                        />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={cartCss.right}>
                <div className={cartCss.rightline}>
                  <span>
                    <p>Subtotal</p>
                    <p>{Rupiah.convert(resultTotal)}</p>
                  </span>
                  <span>
                    <p>Qty</p>
                    <p>{cart?.length}</p>
                  </span>
                </div>
                <span className={cartCss.price}>
                  <p>Total</p>
                  <p>{Rupiah.convert(resultTotal)}</p>
                </span>
                <div className={cartCss.btn_grp}>
                  <button type="submit" onClick={(e) => handleSubmit.mutate(e)}>
                    Pay
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ModalCart showTrans={showTrans} close={handleClose} />
        </section>
      </div>
    </>
  );
}
