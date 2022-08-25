import { useNavigate, useParams } from "react-router-dom";
import Rupiah from "rupiah-format";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import productCss from "../css/productCss.module.css";
import checkToping from "../assets/checkToping.svg";
import Navbar from "../components/navbar/navbar";
import { API } from "../components/config/api";

export default function DetailProductPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleCheck = () => {
    if (show === false) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  // toping
  const [toping, setToping] = useState([]);
  const [topping_id, setIdToping] = useState([]);

  const handleChange = (e) => {
    let updateToping = [...toping];
    if (e.target.checked) {
      updateToping = [...toping, e.target.value];
    } else {
      updateToping.splice(toping.indexOf(e.target.value));
    }
    setToping(updateToping);

    let toppingId = [...topping_id];
    if (e.target.checked) {
      toppingId = [...topping_id, parseInt(e.target.id)];
    } else {
      toppingId.splice(topping_id.indexOf(e.target.id));
    }

    setIdToping(toppingId);
  };

  let { id } = useParams();
  let { data: product } = useQuery("productCache", async () => {
    const response = await API.get("/product/" + id);
    return response.data.data;
  });

  let { data: toppings } = useQuery("toppingsCache", async () => {
    const response = await API.get("/toppings");
    return response.data.data;
  });

  // price sum
  let resultTotal = toping.reduce((a, b) => {
    return a + parseInt(b);
  }, 0);

  let subtotal = product?.price + resultTotal;
  let qty = 1;

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const body = JSON.stringify({
        topping_id: topping_id,
        subtotal: subtotal,
        product_id: parseInt(id),
        qty: qty,
      });

      const response = await API.post("/cart", body, config);
      
      navigate("/");
    } catch (error) {
    }
  });

  return (
    <>
      <Navbar />
      <div>
        <section>
          <div className={productCss.wrap}>
            <div className={productCss.left}>
              <img src={product?.image} alt="oke" />
            </div>
            <div className={productCss.right}>
              <span className={productCss.name}>
                <p className={productCss.titleProduct}>{product?.title}</p>
                <p className={productCss.priceBrown}>
                  {Rupiah.convert(product?.price)}
                </p>
                <div className={productCss.toppings}>
                  {toppings?.map((item, index) => (
                    <div className={productCss.topping} key={index}>
                      <label
                        htmlFor={item?.id}
                        className={productCss.checkContainer}
                      >
                        <input
                          type="checkbox"
                          id={item?.id}
                          onChange={handleChange}
                          value={item?.price}
                          name="toping"
                          className={productCss.testCheck}
                        />
                        <img
                          src={checkToping}
                          alt="check"
                          className={productCss.checkmark}
                        />
                        <img
                          src={item?.image}
                          alt="1"
                          onClick={handleCheck}
                          className={productCss.imageTopping}
                        />
                      </label>
                      <p>{item?.title.substring(0, 17)}</p>
                    </div>
                  ))}
                </div>
              </span>
              <div className={productCss.price}>
                <p>Total</p>
                <p>{Rupiah.convert(product?.price + resultTotal)}</p>
              </div>
              <div className={productCss.btn_grp}>
                <button
                  className={productCss.btn}
                  onClick={(e) => handleSubmit.mutate(e)}
                >
                  Add Cart
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
