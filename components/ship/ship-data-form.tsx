<SelectContent>
                      {seaStateOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleCard>

      {/* Card 6: Ship's Additional Remarks */}
      <CollapsibleCard title="Ship's Additional Remarks" icon={FileText}>
        <div className="space-y-2 pt-2">
          <Label htmlFor="remarks" className="text-xs text-muted-foreground">
            Captain's Note / Daily Remarks
          </Label>
          <Textarea
            id="remarks"
            placeholder="Enter any additional notes, events, or remarks for today..."
            value={formData.remarks || ""}
            onChange={(e) => updateField("remarks", e.target.value)}
            className="min-h-[120px] text-sm resize-y"
          />
        </div>
      </CollapsibleCard>

      {/* Export Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={onExport} size="lg" className="gap-2">
          <Download className="h-4 w-4" />
          Save & Export as JSON
        </Button>
      </div>
    </div>
  );
}
