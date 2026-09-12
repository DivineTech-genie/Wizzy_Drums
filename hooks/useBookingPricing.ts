import { useMemo } from "react";
import { useEvents } from "./useEvents";
import { isEasternNigeriaState } from "@/lib/eastern-states";

const FLIGHT_DEPOSIT_AMOUNT = 150000;

interface BookingPricingResult {
  eventPrice: number;
  depositRate: number;
  depositAmount: number;
  flightDepositAmount: number;
  totalDeposit: number;
  selectedEvent: any;
  isLoading: boolean;
  error: any;
  isEastern: boolean;
  getEventPrice: (eventType: string) => number;
  getDepositRate: (eventType: string) => number;
  getDepositAmount: (eventType: string) => number;
  getTotalDeposit: (
    eventType: string,
    cannotAffordFlight?: boolean,
    eventState?: string,
  ) => number;
}

export function useBookingPricing(
  eventType: string = "Wedding",
  cannotAffordFlight: boolean = false,
  eventState: string = "",
): BookingPricingResult {
  const { events, loading, error } = useEvents();

  const selectedEvent = useMemo(() => {
    return events.find((ev) => ev.value === eventType);
  }, [events, eventType]);

  // 👇 Check if event is in Eastern Nigeria
  const isEastern = useMemo(() => {
    return isEasternNigeriaState(eventState);
  }, [eventState]);

  const getEventPrice = (type: string): number => {
    const event = events.find((ev) => ev.value === type);
    return event?.price || 0;
  };

  const getDepositRate = (type: string): number => {
    const event = events.find((ev) => ev.value === type);
    return event?.depositRate ?? 30;
  };

  const getDepositAmount = (type: string): number => {
    const price = getEventPrice(type);
    const rate = getDepositRate(type);
    return Math.round(price * (rate / 100));
  };

  const getTotalDeposit = (
    type: string,
    includeFlightDeposit: boolean = false,
    state: string = "",
  ): number => {
    const deposit = getDepositAmount(type);
    const isEasternState = isEasternNigeriaState(state);

    const shouldAddFlightDeposit = !isEasternState && includeFlightDeposit;

    return shouldAddFlightDeposit ? deposit + FLIGHT_DEPOSIT_AMOUNT : deposit;
  };

  const eventPrice = getEventPrice(eventType);
  const depositRate = getDepositRate(eventType);
  const depositAmount = getDepositAmount(eventType);

  // 🔥 Calculate total deposit with proper conditions
  const totalDeposit = getTotalDeposit(
    eventType,
    cannotAffordFlight,
    eventState,
  );

  // 🔥 Only show flight deposit amount if it's actually being charged
  const flightDepositAmount =
    !isEastern && cannotAffordFlight ? FLIGHT_DEPOSIT_AMOUNT : 0;

  return {
    eventPrice,
    depositRate,
    depositAmount,
    flightDepositAmount,
    totalDeposit,
    selectedEvent,
    isLoading: loading,
    error,
    isEastern,
    getEventPrice,
    getDepositRate,
    getDepositAmount,
    getTotalDeposit,
  };
}
