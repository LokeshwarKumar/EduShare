package com.edumat.dto;

public class ApprovalRequest {
    private String reason;

    public ApprovalRequest() {}

    public ApprovalRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
