import React from "react";
import { Modal, Tag, Typography, Input, Alert, List } from "antd";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const ReservationModal = ({
  open,
  onClose,
  range,
  plan,
  selectedSeats = [],
  userEmail,
  companyName,
  onCompanyNameChange,
  hasConflicts,
  conflictDetails = [],
  onConfirm,
  isAuthenticated,
}) => {
  const { t } = useTranslation();

  const disabled =
    !isAuthenticated ||
    !range ||
    !plan ||
    selectedSeats.length === 0 ||
    !companyName.trim() ||
    hasConflicts;

  const okText = isAuthenticated
    ? t("reservationModalCenter.ok.reserve")
    : t("reservationModalCenter.ok.login");

  return (
    <Modal
      title={t("reservationModalCenter.title")}
      open={open}
      onCancel={onClose}
      onOk={onConfirm}
      okButtonProps={{ disabled }}
      okText={okText}
      destroyOnClose
    >
      {!isAuthenticated && (
        <Alert
          type="warning"
          message={t("reservationModalCenter.mustBeLoggedIn")}
          style={{ marginBottom: 10 }}
        />
      )}

      {range && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>{t("reservationModalCenter.rangeLabel")}</Text>
          <div style={{ marginTop: 6 }}>
            <Tag>{range.start}</Tag>{" "}
            <Text>{t("reservationModalCenter.to")}</Text>{" "}
            <Tag>{range.end}</Tag>
          </div>
        </div>
      )}

      {plan && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>{t("reservationModalCenter.planLabel")}</Text>{" "}
          <Tag>{plan}</Tag>
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <Text strong>{t("reservationModalCenter.selectedSeatsLabel")}</Text>
        {selectedSeats.length === 0 ? (
          <div style={{ marginTop: 6 }}>
            <Text type="secondary">
              {t("reservationModalCenter.noSeatsSelected")}
            </Text>
          </div>
        ) : (
          <List
            size="small"
            dataSource={selectedSeats}
            renderItem={(s) => (
              <List.Item style={{ padding: "4px 0" }}>
                <Tag>{s.name}</Tag>
              </List.Item>
            )}
            style={{ marginTop: 6, maxHeight: 160, overflowY: "auto" }}
          />
        )}
      </div>

      {userEmail && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>{t("reservationModalCenter.reservationUnderLabel")}</Text>{" "}
          <Text type="secondary">{userEmail}</Text>
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <Text strong>{t("reservationModalCenter.companyLabel")}</Text>
        <Input
          placeholder={t("reservationModalCenter.companyPlaceholder")}
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </div>

      {hasConflicts && conflictDetails.length > 0 && (
        <Alert
          type="error"
          showIcon
          style={{ marginTop: 10 }}
          message={t("reservationModalCenter.conflictsMessage")}
          description={
            <List
              size="small"
              dataSource={conflictDetails}
              renderItem={(item) => (
                <List.Item>
                  <div>
                    <Text strong>{item.name}</Text>
                    {item.reservations.map((r, idx) => (
                      <div key={idx}>
                        <Tag>{r.startDate}</Tag>{" "}
                        <Text>{t("reservationModalCenter.to")}</Text>{" "}
                        <Tag>{r.endDate}</Tag>{" "}
                        <Text>({r.type})</Text>
                      </div>
                    ))}
                  </div>
                </List.Item>
              )}
            />
          }
        />
      )}
    </Modal>
  );
};

export default React.memo(ReservationModal);
