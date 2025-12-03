// src/components/Offices/KiselaVoda/ReservationModal.jsx
import React, { useMemo } from "react";
import { Modal, Alert, Tag, Space, Typography, Input } from "antd";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const ReservationModal = ({
  open,
  onClose,
  range,
  plan,
  selectedRooms,
  userEmail,
  companyName,
  onCompanyNameChange,
  hasConflicts,
  conflictDetails,
  onConfirm,
  isAuthenticated
}) => {
  const { t } = useTranslation();

  const planLabel = useMemo(() => {
    if (plan === "daily") return t("reservationModal.plan.daily");
    if (plan === "weekly") return t("reservationModal.plan.weekly");
    if (plan === "monthly") return t("reservationModal.plan.monthly");
    return plan || "";
  }, [plan, t]);

  const confirmDisabled =
    !isAuthenticated ||
    !range ||
    !selectedRooms ||
    selectedRooms.length === 0 ||
    !companyName.trim() ||
    hasConflicts;

  const okText = !isAuthenticated
    ? t("reservationModal.ok.login")
    : hasConflicts
    ? t("reservationModal.ok.cannot")
    : t("reservationModal.ok.sendEmail");

  return (
    <Modal
      title={t("reservationModal.title")}
      open={open}
      onCancel={onClose}
      onOk={onConfirm}
      okButtonProps={{ disabled: confirmDisabled }}
      okText={okText}
      destroyOnClose
    >
      {!isAuthenticated && (
        <Alert
          type="warning"
          message={t("reservationModal.mustBeLoggedIn")}
          style={{ marginBottom: 12 }}
        />
      )}

      {hasConflicts && conflictDetails.length > 0 && (
        <Alert
          type="error"
          showIcon
          message={t("reservationModal.conflictTitle")}
          description={
            <div style={{ marginTop: 8 }}>
              {conflictDetails.map((room) => (
                <div key={room.id} style={{ marginBottom: 6 }}>
                  <Text strong>{room.name}</Text>
                  <br />
                  {room.reservations.map((r, idx) => (
                    <div key={idx}>
                      <Tag>{r.startDate}</Tag>{" "}
                      {t("reservationModal.to")}{" "}
                      <Tag>{r.endDate}</Tag>{" "}
                      <Text>({r.type})</Text>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          }
          style={{ marginBottom: 12 }}
        />
      )}

      <div style={{ marginBottom: 10 }}>
        <Text strong>{t("reservationModal.planLabel")}</Text>{" "}
        <Text>{planLabel}</Text>
      </div>

      {range && (
        <div style={{ marginBottom: 10 }}>
          <Text strong>{t("reservationModal.rangeLabel")}</Text>
          <div style={{ marginTop: 4 }}>
            <Tag>{range.start}</Tag>{" "}
            {t("reservationModal.to")}{" "}
            <Tag>{range.end}</Tag>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <Text strong>{t("reservationModal.selectedRoomsLabel")}</Text>
        {selectedRooms && selectedRooms.length > 0 ? (
          <Space direction="vertical" style={{ marginTop: 4 }}>
            {selectedRooms.map((room) => (
              <Tag key={room.id}>{room.name}</Tag>
            ))}
          </Space>
        ) : (
          <div style={{ marginTop: 4 }}>
            <Text type="secondary">
              {t("reservationModal.noRoomsSelected")}
            </Text>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 10 }}>
        <Text strong>{t("reservationModal.companyLabel")}</Text>
        <Input
          placeholder={t("reservationModal.companyPlaceholder")}
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </div>

      {userEmail && (
        <div style={{ marginTop: 10 }}>
          <Text type="secondary">
            {t("reservationModal.emailInfo", { email: userEmail })}
          </Text>
        </div>
      )}

      {!hasConflicts && (
        <Alert
          type="info"
          showIcon
          style={{ marginTop: 12 }}
          message={t("reservationModal.infoAfterConfirm")}
        />
      )}
    </Modal>
  );
};

export default React.memo(ReservationModal);
