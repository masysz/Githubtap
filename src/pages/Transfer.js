import React from 'react';
import './Transfer.css';

const Transfer = () => {
  return (
    <>
      <div className="item" data-toggle="modal" data-target="#menutransfer">
        <div className="col">
          <img src="/library/assets/images/header/rajata/transfer.png" alt="Transfer" /><br/><br />Transfer
        </div>
      </div>

      <div className="modal fade action-sheet" id="menutransfer" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="pr-5"></div>
              <h5 className="modal-title">Pilih Transfer</h5>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Transfer;
