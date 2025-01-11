import { Box } from '@mui/material';
import ModalMUI from '@mui/material/Modal';
import React, { ReactNode } from 'react';
import { IoClose } from "react-icons/io5";
import { classNames } from 'shared/lib/classNames/classNames';
import { Button } from '../Button/Button';
import cls from './Modal.module.scss';
interface ModalProps {
   open: boolean;
   className?: string;
   onClose: () => void;
   children: ReactNode;
}

function Modal(props: ModalProps) {
   const { open, onClose, children, className } = props;

   return (

      <ModalMUI
         open={open}
         onClose={onClose}
      >
         <>
            <div className={classNames(cls.modal, {}, [className])}>
               <div className={cls.modalBody}>
                  <button className={cls.modalCloseButton} onClick={() => onClose()}>
                     <IoClose className={cls.modalCloseButtonIcon} />
                  </button>
                  <div className={cls.modalContent}>
                     {children}
                  </div>
               </div>
            </div>

         </>
      </ModalMUI>

   );
}

export default Modal;
