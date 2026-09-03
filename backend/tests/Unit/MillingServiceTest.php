<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Services\MillingService;
use Tests\TestCase;

class MillingServiceTest extends TestCase
{
    /**
     * Test that a merma greater than 10% triggers an alert.
     */
    public function test_milling_yield_triggers_alert_when_merma_exceeds_ten_percent(): void
    {
        $service = new MillingService();

        // 1000 kg entrada, 850 kg salida = 150 kg merma (15%)
        $result = $service->calculateYield(1000.0, 850.0);

        $this->assertTrue($result['alert']);
        $this->assertEquals(15.0, $result['merma_percentage']);
    }

    /**
     * Test that a merma less than or equal to 10% does not trigger an alert.
     */
    public function test_milling_yield_does_not_trigger_alert_when_merma_is_low(): void
    {
        $service = new MillingService();

        // 1000 kg entrada, 950 kg salida = 50 kg merma (5%)
        $result = $service->calculateYield(1000.0, 950.0);

        $this->assertFalse($result['alert']);
        $this->assertEquals(5.0, $result['merma_percentage']);
    }
}
