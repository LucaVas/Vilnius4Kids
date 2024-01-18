export enum ReportStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in progress',
    CLOSED = 'closed',
}

export function getStatusFromString(
    statusString: string
): ReportStatus | undefined {
    const enumValues = Object.values(ReportStatus);
    const matchingValue = enumValues.find(
        (value) => value.toLowerCase() === statusString.toLowerCase()
    );

    return matchingValue;
}
