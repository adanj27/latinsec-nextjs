"use client";

import { useRef, useState } from 'react';
import ContactImage from '@/assets/images/contact-image.webp';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';
import Image from 'next/image';
import Turnstile from 'react-turnstile';
import emailjs from '@emailjs/browser';

export const FormContact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    phone_number: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    from_name: '',
    from_email: '',
    message: '',
  });

  const [turnstileToken, setTurnstileToken] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = 'Este campo es obligatorio';
    const newErrors = {
      from_name: formData.from_name ? '' : errorMessage,
      from_email: formData.from_email ? '' : errorMessage,
      message: formData.message ? '' : errorMessage,
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error !== "") && turnstileToken) {
      try {
        const result = await emailjs.sendForm(
          'service_k3zxjvg',
          'template_mzu0o45',
          form.current,
          'yqqUqtFZcCX7uVfoi'
        );

        if (result.text === 'OK') {
          console.log("Mensaje enviado correctamente");
          setFormData({
            from_name: '',
            from_email: '',
            phone_number: '',
            message: '',
          });
        } else {
          console.log("Error al enviar el mensaje");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };

  const areAllFieldsFilled = () => {
    return (
      formData.from_name.trim() !== '' &&
      formData.from_email.trim() !== '' &&
      formData.message.trim() !== '' &&
      turnstileToken !== null
    );
  };

  return (
    <section className="bg-white flex w-full">
      <div className="w-[364px] hidden lg:flex">
        <Image src={ContactImage} alt="" className="object-cover" />
      </div>
      <form ref={form} onSubmit={handleSubmit} className="px-[50px] py-[40px] lg:w-2/3 w-full">
        <h4 className="font-bold text-[40px] text-[#252B42]">Contacto</h4>
        <div className="w-full">
          <Input
            label="Nombre*"
            name="from_name"
            type="text"
            required
            value={formData.from_name}
            placeholder="Nombre"
            error={errors.from_name}
            onChange={handleInputChange}
          />
          <Input
            label="Email*"
            name="from_email"
            type="email"
            required
            value={formData.from_email}
            placeholder="ejemplo@latinsec.com"
            error={errors.from_email}
            onChange={handleInputChange}
          />
          <Input
            label="Teléfono"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            placeholder="(123) 123456"
            pattern="[0-9]*"
            onChange={handleInputChange}
          />
          <TextArea
            label="Asunto*"
            name="message"
            required
            value={formData.message}
            placeholder="Mensaje"
            error={errors.message}
            onChange={handleInputChange}
          />
          <Turnstile
            sitekey="0x4AAAAAAAf6djTtczCLprdy"
            onVerify={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
          />
          <button
            type="submit"
            className={`rounded-md text-center font-bold text-sm w-full py-[15px] text-white transition-colors ${
              areAllFieldsFilled() ? 'bg-[#0063A5]' : 'bg-slate-200'
            } focus:outline-none`}
            disabled={!areAllFieldsFilled()}
          >
            Enviar
          </button>
        </div>
      </form>
    </section>
  );
};