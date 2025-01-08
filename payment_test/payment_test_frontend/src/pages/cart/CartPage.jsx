import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart } from '../../store/slices/cartSlice';
import { addListener } from '@reduxjs/toolkit';

function CartPage() {
  const { cartItems } = useSelector(state => state.cart);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const studentId = "testman"

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    script.onload = () => {

      if (window.IMP) {
        const IMP = window.IMP;
        IMP.init("imp56058426");
        console.log("IMP 초기화 완료");
      } else {
        console.error("IMP 로드 실패");
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [])

  const onClickPay = async () => {

    try {

      // 1. 주문 생성 요청
      const orderResponse = await fetch('http://localhost:8081/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentId,
          courses: cartItems.map(item => ({
            courseId: item.id,
            price: item.price
          })),
          totalAmount: totalPrice
        })
      });

      if (!orderResponse.ok) {
        throw new Error('주문 생성에 실패했습니다.');
      }

      const orderData = await orderResponse.json();
      console.log("Order creation response:", orderData);

      // 2. 포트원 결제창 호출
      const { IMP } = window;
      IMP.init("imp56058426");

      const itemName = cartItems.length > 1
        ? `${cartItems[0].title} 외 ${cartItems.length - 1}건`
        : cartItems[0].title;

      IMP.request_pay({
        pg: "kakaopay",
        pay_method: "card",
        merchant_uid: orderData.merchantUid,
        amount: orderData.totalAmount,
        name: itemName,
        notice_url: "https://202a-58-120-167-126.ngrok-free.app/api/payments/webhook",
        buyer_name: studentId
      }, async function (rsp) {

        console.log("response: ", rsp)

        if (rsp.success) {
          try {
            const verifyResponse = await fetch('http://localhost:8081/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                impUid: rsp.imp_uid,
                merchantUid: rsp.merchant_uid,
                buyerName: rsp.buyer_name,
                amount: rsp.paid_amount,
                status: rsp.status,
                payMethod: rsp.pay_method
              })
            });

            const verifyResult = await verifyResponse.json();
            console.log("Verification result:", verifyResult)

            if (verifyResult.status === 'success') {
              alert('결제가 완료되었습니다.');
              // navigate(''); 등록 완료 페이지 등 원하는 페이지로 이동
            } else if (verifyResult.status === 'pending') {
              alert(`
              결제는 정상적으로 완료되었습니다.
              현재 서버 검증 과정에서 일시적인 문제가 발생했으나,
              수강 등록은 자동으로 처리될 예정입니다.
              (1-2분 내로 자동 처리되며, 문제 시 고객센터로 문의 부탁드립니다)
                                      `.trim());
              // navigate(''); 결제 내역 패이지로 이동                          
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert(`
            결제는 완료되었으나 서버 검증 과정에서 문제가 발생했습니다.
            수강 등록은 자동으로 처리될 예정이며,
            결제 내역 페이지에서 확인하실 수 있습니다.
                    `.trim());
            // navigate(''); 결제 내역 패이지로 이동 
          }
        } else {
          alert(`결제에 실패했습니다. 사유: ${rsp.error_msg}`);
        }

      });

    } catch (error) {
      console.error('결제 처리 중 오류 발생: ', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }

  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">장바구니</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">장바구니가 비어 있습니다.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map(course => (
              <div key={course.id} className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-gray-500">{course.instructor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₩{course.price.toLocaleString()}</p>
                    <button
                      onClick={() => dispatch(removeFromCart(course.id))}
                      className="text-red-500 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-lg font-semibold mb-4">주문 요약</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>₩{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={onClickPay} className="w-full bg-primary text-white py-2 px-4 rounded-md block text-center">
              결제하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;