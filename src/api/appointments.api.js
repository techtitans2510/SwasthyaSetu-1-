import appointmentsMock from "../mocks/appointments.mock";

const USE_MOCK_DATA = true;

export async function getAppointments() {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });

    return appointmentsMock;
  }

  const response = await fetch(
    "/api/patient/appointments"
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch appointments"
    );
  }

  return response.json();
}

export async function getAppointmentById(id) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });

    const appointment = appointmentsMock.find(
      (item) => item.id === id
    );

    if (!appointment) {
      throw new Error(
        "Appointment not found"
      );
    }

    return appointment;
  }

  const response = await fetch(
    `/api/patient/appointments/${id}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch appointment"
    );
  }

  return response.json();
}

export async function requestAppointment(
  appointmentData
) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    return {
      id: `APT-${Date.now()}`,
      ...appointmentData,
      status: "pending"
    };
  }

  const response = await fetch(
    "/api/patient/appointments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointmentData)
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to request appointment"
    );
  }

  return response.json();
}

export async function cancelAppointment(id) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });

    return {
      success: true,
      id
    };
  }

  const response = await fetch(
    `/api/patient/appointments/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "cancelled"
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to cancel appointment"
    );
  }

  return response.json();
}