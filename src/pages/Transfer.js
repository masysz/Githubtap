import React, { useState } from 'react';
import Modal from 'react-modal';
import '../App.css';

// Set the root element for the modal
Modal.setAppElement('#root');

const Transfer = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="item" onClick={openModal}>
        <div className="col">
          <img src="/library/assets/images/header/rajata/transfer.png" alt="Transfer" /><br/><br />Transfer
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <div className="pr-5"></div>
          <h5 className="modal-title">Pilih Transfer</h5>
          <button onClick={closeModal} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <div className="menu-list mt-1">
            <div className="app-menu">
              <ul className="listview image-listview">
                <li>
                  <div className="item">
                    <a href="<?= base_url('deposit/transfer') ?>" className="item">
                      <div className="icon-box bg-upgrade-primary">
                        <ion-icon name="navigate" className="text-primary"></ion-icon>
                      </div>
                      <div className="in">
                        <h5 className="mb-0">
                          <b>Transfer Sesama Member</b>
                        </h5>
                      </div>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="item">
                    <a href="<?= base_url('account/request_wd') ?>" className="item">
                      <div className="icon-box bg-upgrade-primary">
                        <ion-icon name="navigate" className="text-primary"></ion-icon>
                      </div>
                      <div className="in">
                        <h5 className="mb-0">
                          <b>Transfer Ke Bank</b>
                        </h5>
                      </div>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Transfer;
